import type { MediaService } from '@/features/media/services/media-service';
import { MockMediaService } from '@/features/media/services/mock/mock-media-service';

const mediaServiceSingleton = new MockMediaService();

/**
 * Returns the active media service implementation.
 */
export function getMediaService(): MediaService {
  return mediaServiceSingleton;
}
