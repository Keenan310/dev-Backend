import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
export const DoSpacesServiceLib = 'lib:do-spaces-service';

const spacesEndpoint = process.env.SPACES_ENDPOINT;
const spacesRegion = process.env.SPACES_REGION || 'us-east-1';

const normalizeEndpoint = (value?: string) => {
  if (!value) return value;
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
};

const S3 = new S3Client({
  endpoint: normalizeEndpoint(spacesEndpoint),
  region: spacesRegion,
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY || '',
    secretAccessKey: process.env.SPACES_SECRET_KEY || '',
  },
});


// Now comes the provider
export const DoSpacesServicerovider: Provider<S3Client> = {
  provide: DoSpacesServiceLib,
  useValue: S3,
};
