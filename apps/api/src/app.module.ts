import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { StorageModule } from './storage/storage.module';
import { ProjectModule } from './project/project.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    UserModule,
    VideoModule,
    StorageModule,
    ProjectModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
