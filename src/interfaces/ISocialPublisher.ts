/**
 * Interface for all social media platform publishers
 * Defines common methods that must be implemented by all platform-specific publishers
 */
export interface ISocialPublisher {
  /**
   * Publishes a video to the social media platform
   * @param videoPath Path to the video file
   * @param caption Caption text for the video
   * @param hashtags Array of hashtags to include
   * @param accountId Platform-specific account identifier
   * @returns Promise resolving to boolean indicating success or failure
   */
  publishVideo(
    videoPath: string,
    caption: string,
    hashtags: string[],
    accountId: string
  ): Promise<boolean>;

  /**
   * Checks if the publisher is properly configured and ready to publish
   * @param accountId Platform-specific account identifier
   * @returns Promise resolving to boolean indicating if publisher is ready
   */
  isReady(accountId: string): Promise<boolean>;
}
