import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Music {
  @Prop({ required: true, enum: ['mp3', 'link'] }) // Chỉ chấp nhận 'mp3' hoặc 'link'
  type!: string;

  @Prop({ required: true }) // Tên video
  name!: string;

  @Prop({ required: true }) // URL hoặc đường dẫn tệp
  source!: string;

  @Prop({ default: Date.now }) // Thời gian thêm video
  addedAt!: Date;
}

export const MusicSchema = SchemaFactory.createForClass(Music);

@Schema()
export class Playlist {
  @Prop({ required: true }) // Tên playlist
  name!: string;

  @Prop({ type: [MusicSchema], default: [] }) // Mảng các video
  videos!: Music[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

@Schema()
export class Video {
  @Prop({ required: true }) // Tên người dùng
  username!: string;

  @Prop({ type: [PlaylistSchema], default: [] }) // Mảng các playlist
  playlists!: Playlist[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
