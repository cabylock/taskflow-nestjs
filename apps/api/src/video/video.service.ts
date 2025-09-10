import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.schema';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videocollection: Model<VideoDocument>
  ) {}

  async get(video: Video) {
    try {
      const existingUser = await this.videocollection.findOne({
        username: video.username,
      });
      if (!existingUser) {
        return { message: 'Playlist not found' };
      }
      return { message: 'Playlist found', content: existingUser };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get playlist');
    }
  }

  async update(video: Video) {
    try {
      const existingUser = await this.videocollection.findOne({
        username: video.username,
      });
      if (!existingUser) {
        const newVideo = new this.videocollection(video);
        await newVideo.save();
        return { message: 'Playlist created successfully', content: newVideo };
      }

      const updatedVideo = await this.videocollection.findOneAndUpdate(
        { username: video.username },
        video,
        { new: true }
      );

      return {
        message: 'Playlist updated successfully',
        playlist: updatedVideo,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update playlist');
    }
  }

  async delete(video: Video) {
    try {
      const existingUser = await this.videocollection.findOne({
        username: video.username,
      });
      if (!existingUser) {
        throw new NotFoundException('Playlist not found');
      }

      await this.videocollection.deleteOne({ username: video.username });
      return { message: 'Playlist deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete playlist');
    }
  }
}
