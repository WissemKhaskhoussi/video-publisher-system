/**
 * Represents video content with associated metadata
 */
export interface VideoContent {
  /**
   * Path to the video file
   */
  videoPath: string;
  
  /**
   * Caption to be used with the video
   */
  caption: string;
  
  /**
   * Array of hashtags to be included with the post
   */
  hashtags: string[];
  
  /**
   * Optional flag indicating if the video has been published
   */
  published?: boolean;
  
  /**
   * Optional timestamp when the video was published
   */
  publishedAt?: Date;
  
  /**
   * Optional platform where the video was published
   */
  publishedTo?: string;
}
