import fs from 'fs';
import path from 'path';
import { ProductConfig } from '../types/ProductConfig';

/**
 * Service for loading and validating configuration
 */
export class ConfigService {
  private configPath: string;
  private config: Record<string, ProductConfig> = {};

  /**
   * Creates a new ConfigService instance
   * @param configPath Path to the configuration directory
   */
  constructor(configPath: string) {
    this.configPath = configPath;
  }

  /**
   * Loads the product configuration from JSON file
   * @returns Promise resolving to the loaded configuration
   */
  async loadConfig(): Promise<Record<string, ProductConfig>> {
    try {
      const configFilePath = path.join(this.configPath, 'products.config.json');
      const configData = await fs.promises.readFile(configFilePath, 'utf8');
      this.config = JSON.parse(configData);
      
      // Validate the loaded configuration
      this.validateConfig();
      
      return this.config;
    } catch (error) {
      console.error(`[CONFIG SERVICE] Failed to load configuration: ${error}`);
      throw new Error(`Failed to load configuration: ${error}`);
    }
  }

  /**
   * Gets the configuration for a specific product
   * @param productId Product identifier
   * @returns Product configuration or undefined if not found
   */
  getProductConfig(productId: string): ProductConfig | undefined {
    return this.config[productId];
  }

  /**
   * Gets all product configurations
   * @returns Record of all product configurations
   */
  getAllProductConfigs(): Record<string, ProductConfig> {
    return this.config;
  }

  /**
   * Validates the loaded configuration
   * @throws Error if configuration is invalid
   */
  private validateConfig(): void {
    // Check if config is empty
    if (Object.keys(this.config).length === 0) {
      throw new Error('Configuration is empty');
    }

    // Validate each product configuration
    for (const [productId, productConfig] of Object.entries(this.config)) {
      // Check if platforms are defined
      if (!productConfig.platforms || Object.keys(productConfig.platforms).length === 0) {
        throw new Error(`Product ${productId} has no platforms defined`);
      }

      // Check if content path is defined
      if (!productConfig.contentPath) {
        throw new Error(`Product ${productId} has no content path defined`);
      }

      // Validate each platform configuration
      for (const [platformName, platformConfig] of Object.entries(productConfig.platforms)) {
        // Check if account ID is defined
        if (!platformConfig.accountId) {
          throw new Error(`Platform ${platformName} for product ${productId} has no account ID defined`);
        }

        // Check if posts per day is defined and valid
        if (!platformConfig.postsPerDay || platformConfig.postsPerDay <= 0) {
          throw new Error(`Platform ${platformName} for product ${productId} has invalid posts per day`);
        }

        // Check if post times are defined and valid
        if (!platformConfig.postTimes || platformConfig.postTimes.length === 0) {
          throw new Error(`Platform ${platformName} for product ${productId} has no post times defined`);
        }

        // Check if post times are in the correct format (HH:MM)
        for (const postTime of platformConfig.postTimes) {
          if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(postTime)) {
            throw new Error(`Platform ${platformName} for product ${productId} has invalid post time format: ${postTime}`);
          }
        }

        // Check if number of post times matches posts per day
        if (platformConfig.postTimes.length !== platformConfig.postsPerDay) {
          throw new Error(`Platform ${platformName} for product ${productId} has mismatched post times and posts per day`);
        }
      }
    }
  }
}
