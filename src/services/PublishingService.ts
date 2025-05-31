import { ProductConfig } from '../types/ProductConfig';
import { ISocialPublisher } from '../interfaces/ISocialPublisher';
import { ContentService } from './ContentService';

/**
 * Service for orchestrating the publishing flow for each product and platform
 */
export class PublishingService {
  private publishers: Map<string, ISocialPublisher> = new Map();
  private contentServices: Map<string, ContentService> = new Map();

  /**
   * Creates a new PublishingService instance
   */
  constructor() {}

  /**
   * Registers a publisher for a specific platform
   * @param platform Platform name
   * @param publisher Publisher implementation
   */
  registerPublisher(platform: string, publisher: ISocialPublisher): void {
    this.publishers.set(platform, publisher);
    console.log(`[PUBLISHING SERVICE] Registered publisher for platform: ${platform}`);
  }

  /**
   * Initializes content services for each product
   * @param productConfigs Map of product configurations
   */
  initializeContentServices(productConfigs: Record<string, ProductConfig>): void {
    for (const [productId, config] of Object.entries(productConfigs)) {
      this.contentServices.set(productId, new ContentService(config.contentPath));
      console.log(`[PUBLISHING SERVICE] Initialized content service for product: ${productId}`);
    }
  }

  /**
   * Publishes content for a specific product and platform
   * @param productId Product identifier
   * @param platform Platform name
   * @param accountId Platform-specific account identifier
   * @returns Promise resolving to true if publishing was successful
   */
  async publishContent(productId: string, platform: string, accountId: string): Promise<boolean> {
    console.log(`[PUBLISHING SERVICE] Publishing content for ${productId} on ${platform}`);
    
    // Get the publisher for the platform
    const publisher = this.publishers.get(platform);
    if (!publisher) {
      console.error(`[PUBLISHING SERVICE] No publisher registered for platform: ${platform}`);
      return false;
    }

    // Check if publisher is ready
    const isReady = await publisher.isReady(accountId);
    if (!isReady) {
      console.error(`[PUBLISHING SERVICE] Publisher for ${platform} is not ready`);
      return false;
    }

    // Get the content service for the product
    const contentService = this.contentServices.get(productId);
    if (!contentService) {
      console.error(`[PUBLISHING SERVICE] No content service for product: ${productId}`);
      return false;
    }

    // Get the next video to publish
    const videoContent = await contentService.getNextVideo();
    if (!videoContent) {
      console.error(`[PUBLISHING SERVICE] No video content available for product: ${productId}`);
      return false;
    }

    try {
      // Publish the video
      const success = await publisher.publishVideo(
        videoContent.videoPath,
        videoContent.caption,
        videoContent.hashtags,
        accountId
      );

      if (success) {
        // Mark the video as published
        await contentService.markAsPublished(videoContent.videoPath, platform);
        console.log(`[PUBLISHING SERVICE] Successfully published video for ${productId} on ${platform}`);
        return true;
      } else {
        console.error(`[PUBLISHING SERVICE] Failed to publish video for ${productId} on ${platform}`);
        return false;
      }
    } catch (error) {
      console.error(`[PUBLISHING SERVICE] Error publishing content: ${error}`);
      return false;
    }
  }
}
