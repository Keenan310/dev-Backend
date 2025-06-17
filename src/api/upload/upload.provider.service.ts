import * as AWS from 'aws-sdk';
import { Provider } from '@nestjs/common';
export const DoSpacesServiceLib = 'lib:do-spaces-service';

const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);

const S3 = new AWS.S3({
  endpoint: spacesEndpoint.href,
  credentials: new AWS.Credentials({
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY,
  }),
});


// Now comes the provider
export const DoSpacesServicerovider: Provider<AWS.S3> = {
  provide: DoSpacesServiceLib,
  useValue: S3,
};

