import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectcollection: Model<ProjectDocument>
  ) {}

  async getProject(username: string) {
    const project = await this.projectcollection.findOne({
      username: username,
    });
    if (!project) {
      return { message: 'Project not found' };
    }

    return { message: 'Project found', content: project };
  }

  async updateProject(project: Project) {
    const existingProject = await this.projectcollection.findOne({
      username: project.username,
    });
    if (!existingProject) {
      const newProject = new this.projectcollection(project);
      await newProject.save();
      return { message: 'Project created successfully', content: newProject };
    }

    await this.projectcollection.findOneAndUpdate(
      { username: project.username },
      project,
      { new: true }
    );
    return { message: 'Project updated successfully', project: project };
  }

  async deleteProject(project: Project) {
    const existingProject = await this.projectcollection.findOne({
      username: project.username,
    });
    if (!existingProject) {
      return { message: 'Project not found' };
    }

    await this.projectcollection.deleteOne({ username: project.username });
    return { message: 'Project deleted successfully' };
  }
}
