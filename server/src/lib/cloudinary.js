import { createHash } from 'node:crypto';
import { env } from '../config/env.js';
import { Errors } from './errors.js';

export function getCloudinaryUploadConfig() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw Errors.internal('Cloudinary credentials are not configured');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'dev2win/avatars';
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
  const signature = createHash('sha1').update(paramsToSign).digest('hex');

  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  };
}
