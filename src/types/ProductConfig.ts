/**
 * Configuration interface for a product
 */
export interface ProductConfig {
  /**
   * Platform-specific configuration
   */
  platforms: {
    [platformName: string]: {
      /**
       * Account identifier for the platform
       */
      accountId: string;
      
      /**
       * Number of posts per day
       */
      postsPerDay: number;
      
      /**
       * Array of posting times in 24-hour format (HH:MM)
       */
      postTimes: string[];
    };
  };
  
  /**
   * Path to the content directory for this product
   */
  contentPath: string;
}
