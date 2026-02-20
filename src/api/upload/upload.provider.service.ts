// src/api/upload/upload.provider.service.ts
import { Provider } from '@nestjs/common';

export const DoSpacesServiceLib = 'lib:do-spaces-service';

/**
 * DigitalOcean Spaces removed.
 * This provider is kept ONLY so your existing UploadModule import does not break.
 * UploadService no longer uses it.
 */
export const DoSpacesServicerovider: Provider = {
  provide: DoSpacesServiceLib,
  useValue: null,
};