import { Controller, Post, Get, Body, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from '@nestjs/schedule/node_modules/cron';

@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  @Post('send')
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('html') html?: string
  ): Promise<{ message: string }> {
    await this.emailService.sendMail(to, subject, text, html);
    return { message: 'Email sent successfully!' };
  }

  @Post('schedule')
  async scheduleOrUpdateEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @Body('html') html?: string
  ): Promise<{ message: string }> {
    const sendDate = new Date(`${date}T${time}:00Z`);
    sendDate.setHours(sendDate.getHours() - 7); // Adjust for timezone
    const jobKey = `${text}`;

    this.logger.log(`Scheduling email to ${to} at ${sendDate.toISOString()}`);

    // Remove the old job if it exists
    if (this.schedulerRegistry.doesExist('cron', jobKey)) {
      this.schedulerRegistry.deleteCronJob(jobKey);
      this.logger.log(`Deleted existing job with key ${jobKey}`);
    }

    // Check if the send date is in the past
    if (sendDate <= new Date()) {
      this.logger.warn(`WARNING: Date in past. Will never be fired.`);
      return { message: 'WARNING: Date in past. Will never be fired.' };
    }

    // Schedule the new job
    const job = new CronJob(sendDate, async () => {
      this.logger.log(`Executing job for ${to} at ${sendDate.toISOString()}`);
      await this.emailService.sendMail(to, subject, text, html);
      this.schedulerRegistry.deleteCronJob(jobKey);
      this.logger.log(`Email sent to ${to} and job ${jobKey} deleted`);
    });

    this.schedulerRegistry.addCronJob(jobKey, job);
    job.start();
    this.logger.log(`Scheduled new job with key ${jobKey}`);

    return { message: 'Email scheduled successfully!' };
  }

  @Get('scheduled-jobs')
  listScheduledJobs(): { jobs: { name: string; nextRun: string }[] } {
    const jobs = this.schedulerRegistry.getCronJobs();
    const jobDetails: { name: string; nextRun: string }[] = [];
    jobs.forEach((value, key) => {
      const nextRun = value.nextDates().toString(); // Get the next run time
      jobDetails.push({ name: key, nextRun });
    });
    return { jobs: jobDetails };
  }

  @Post('cancel')
  async cancelScheduledEmail(): Promise<{ message: string }> {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      this.schedulerRegistry.deleteCronJob(key);
      this.logger.log(`Deleted job with key ${key}`);
    });
    return { message: 'All scheduled emails cancelled successfully' };
  }
}
