import { ProductConfig } from '../types/ProductConfig';
import { PublishingService } from './PublishingService';

/**
 * Service for scheduling and triggering publishing events
 */
export class SchedulerService {
  private productConfigs: Record<string, ProductConfig>;
  private publishingService: PublishingService;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  /**
   * Creates a new SchedulerService instance
   * @param productConfigs Map of product configurations
   * @param publishingService Publishing service instance
   */
  constructor(
    productConfigs: Record<string, ProductConfig>,
    publishingService: PublishingService
  ) {
    this.productConfigs = productConfigs;
    this.publishingService = publishingService;
  }

  /**
   * Starts the scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('[SCHEDULER SERVICE] Scheduler is already running');
      return;
    }

    console.log('[SCHEDULER SERVICE] Starting scheduler');
    this.isRunning = true;

    // Check for scheduled posts every minute
    this.intervalId = setInterval(() => this.checkSchedule(), 60000);
    
    // Also check immediately on start
    this.checkSchedule();
  }

  /**
   * Stops the scheduler
   */
  stop(): void {
    if (!this.isRunning || !this.intervalId) {
      console.log('[SCHEDULER SERVICE] Scheduler is not running');
      return;
    }

    console.log('[SCHEDULER SERVICE] Stopping scheduler');
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
  }

  /**
   * Checks the schedule for all products and platforms
   */
  private async checkSchedule(): Promise<void> {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    console.log(`[SCHEDULER SERVICE] Checking schedule at ${currentTimeString}`);

    // Check each product and platform
    for (const [productId, config] of Object.entries(this.productConfigs)) {
      for (const [platform, platformConfig] of Object.entries(config.platforms)) {
        // Check if current time matches any of the scheduled post times
        if (platformConfig.postTimes.includes(currentTimeString)) {
          console.log(`[SCHEDULER SERVICE] Scheduled post time matched for ${productId} on ${platform} at ${currentTimeString}`);
          
          try {
            // Trigger publishing
            await this.publishingService.publishContent(
              productId,
              platform,
              platformConfig.accountId
            );
          } catch (error) {
            console.error(`[SCHEDULER SERVICE] Error publishing content: ${error}`);
          }
        }
      }
    }
  }

  /**
   * Updates the product configurations
   * @param productConfigs New product configurations
   */
  updateConfigs(productConfigs: Record<string, ProductConfig>): void {
    this.productConfigs = productConfigs;
    console.log('[SCHEDULER SERVICE] Updated product configurations');
  }
}
