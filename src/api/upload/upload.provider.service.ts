
import { Provider } from '@nestjs/common';

export const DoSpacesServiceLib = 'lib:do-spaces-service';

export const DoSpacesServicerovider: Provider = {
  provide: DoSpacesServiceLib,
  useValue: null,
};