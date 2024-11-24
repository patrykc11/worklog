import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH_METADATA_KEY } from '../../constants';

export function WithAuth(): ClassDecorator & MethodDecorator {
  return SetMetadata(SKIP_AUTH_METADATA_KEY, false);
}
