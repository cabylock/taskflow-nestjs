import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class File {
  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  filetype!: string;

  @Prop({ required: true })
  filepath!: string;
}

export const FileSchema = SchemaFactory.createForClass(File);

@Schema()
export class Task {
  @Prop()
  name!: string;

  @Prop()
  startDate!: string;

  @Prop()
  endDate!: string;

  @Prop({ enum: ['low', 'medium', 'high'], default: 'low' })
  level!: string;

  @Prop()
  note!: string;

  @Prop({ type: [FileSchema], default: [] })
  files!: File[];

  @Prop({ default: false })
  completed_start!: boolean;

  @Prop({ default: false })
  completed_end!: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

@Schema()
export class Project {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ type: [Task], default: [] })
  Tasks!: Task[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
