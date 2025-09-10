import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    // Read configuration from environment variables
    this.bucket = process.env.AWS_S3_BUCKET_NAME || '';
    this.region =
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

    this.s3 = new S3Client({
      region: this.region,
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          }
        : undefined,
    });

    if (!this.bucket) {
      // Do not throw here to keep DI safe; throw on actual upload if missing
      // Consumers should set S3_BUCKET in environment.
    }
  }
  async uploadFile(file: Express.Multer.File, folder?: string) {
    if (!this.bucket) {
      throw new InternalServerErrorException('S3_BUCKET is not configured');
    }

    const keyPrefix =
      folder && folder.trim() ? `${folder.replace(/\/+$/g, '')}/` : '';
    const key = `${keyPrefix}${Date.now()}-${randomUUID()}-${
      file.originalname
    }`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);

      const getCommand = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      // Construct public URL (works for standard S3 endpoints)
      const url = await getSignedUrl(this.s3, getCommand, { expiresIn: 3600 });
      return { url, key };
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to upload file to S3' + err
      );
    }
  }
}
