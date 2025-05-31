import path from 'path';
import { ConfigService } from './services/ConfigService';
import { PublishingService } from './services/PublishingService';
import { SchedulerService } from './services/SchedulerService';
import { InstagramPublisher } from './publishers/InstagramPublisher';
import { Logger } from './services/Logger';

/**
 * Main entry point for the video publisher system
 */
async function main() {
  console.log('Starting Video Publisher System...');
  
  try {
    // Initialize configuration
    const configDir = path.join(__dirname, '../config');
    const configService = new ConfigService(configDir);
    const productConfigs = await configService.loadConfig();
    
    console.log('Loaded product configurations:', Object.keys(productConfigs));
    
    // Initialize publishing service
    const publishingService = new PublishingService();
    
    // Register publishers
    publishingService.registerPublisher('instagram', new InstagramPublisher());
    
    // Initialize content services
    publishingService.initializeContentServices(productConfigs);
    
    // Initialize scheduler
    const schedulerService = new SchedulerService(productConfigs, publishingService);
    
    // Set up loggers for each product
    for (const productId of Object.keys(productConfigs)) {
      const logPath = path.join(__dirname, '../logs', `${productId}.log`);
      const logger = new Logger(productId, logPath);
      logger.info('Initialized logger');
    }
    
    // Start the scheduler
    schedulerService.start();
    
    console.log('Video Publisher System started successfully');
    
    // For testing purposes, simulate a publishing event
    console.log('Simulating a publishing event for testing...');
    
    // Get the first product and platform
    const firstProductId = Object.keys(productConfigs)[0];
    const firstPlatform = Object.keys(productConfigs[firstProductId].platforms)[0];
    const accountId = productConfigs[firstProductId].platforms[firstPlatform].accountId;
    
    // Publish content
    const result = await publishingService.publishContent(
      firstProductId,
      firstPlatform,
      accountId
    );
    
    console.log(`Test publishing result: ${result ? 'Success' : 'Failure'}`);
    
    // Keep the process running
    console.log('System is now running. Press Ctrl+C to stop.');
  } catch (error) {
    console.error('Error starting the system:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
