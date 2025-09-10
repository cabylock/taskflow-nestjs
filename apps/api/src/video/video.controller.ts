import { Controller } from '@nestjs/common';
import { VideoService } from './video.service';
import { Post, Body } from '@nestjs/common';

import { Video } from './video.schema';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('get')
  async get_playlist(@Body() playlist: Video) {
    return this.videoService.get(playlist);
  }

  @Post('update')
  async update_playlist(@Body() playlist: Video) {
    return this.videoService.update(playlist);
  }

  @Post('delete')
  async delete_playlist(@Body() playlist: Video) {
    return this.videoService.delete(playlist);
  }
}
