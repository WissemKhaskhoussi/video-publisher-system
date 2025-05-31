import fs from 'fs';
import path from 'path';
import { VideoContent } from '../types/VideoContent';

/**
 * Service for loading and managing video content and metadata
 */
export class ContentService {
  private contentPath: string;
  private publishedLogPath: string;
  private publishedVideos: Set<string> = new Set();

  /**
   * Creates a new ContentService instance
   * @param contentPath Path to the content directory
   */
  constructor(contentPath: string) {
    this.contentPath = contentPath;
    this.publishedLogPath = path.join(contentPath, '.published.log');
    this.loadPublishedLog();
  }

  /**
   * Loads the list of published videos from the log file
   */
  private loadPublishedLog(): void {
    try {
      if (fs.existsSync(this.publishedLogPath)) {
        const logContent = fs.readFileSync(this.publishedLogPath, 'utf8');
        const publishedEntries = logContent.split('\n').filter(line => line.trim() !== '');
        
        for (const entry of publishedEntries) {
          const [videoPath] = entry.split(',');
          if (videoPath) {
            this.publishedVideos.add(videoPath);
          }
        }
        
        console.log(`[CONTENT SERVICE] Loaded ${this.publishedVideos.size} published videos from log`);
      }
    } catch (error) {
      console.error(`[CONTENT SERVICE] Failed to load published log: ${error}`);
      // Continue without the log, it will be created when videos are published
    }
  }

  /**
   * Gets the next unpublished video for a product
   * @returns Promise resolving to the next video content or null if none available
   */
  async getNextVideo(): Promise<VideoContent | null> {
    try {
      // Get all video files in the content directory
      const files = await fs.promises.readdir(this.contentPath);
      const videoFiles = files.filter(file => 
        file.endsWith('.mp4') && 
        !this.publishedVideos.has(path.join(this.contentPath, file))
      );

      if (videoFiles.length === 0) {
        console.log(`[CONTENT SERVICE] No unpublished videos available in ${this.contentPath}`);
        return null;
      }

      // Select a random video from the available ones
      const randomIndex = Math.floor(Math.random() * videoFiles.length);
      const selectedVideo = videoFiles[randomIndex];
      const videoPath = path.join(this.contentPath, selectedVideo);

      // Load captions and hashtags
      const caption = await this.getRandomCaption();
      const hashtags = await this.getRandomHashtags();

      if (!caption || !hashtags) {
        console.error('[CONTENT SERVICE] Failed to load caption or hashtags');
        return null;
      }

      return {
        videoPath,
        caption,
        hashtags
      };
    } catch (error) {
      console.error(`[CONTENT SERVICE] Failed to get next video: ${error}`);
      return null;
    }
  }

  /**
   * Gets a random caption from the captions.json file
   * @returns Promise resolving to a random caption or null if none available
   */
  private async getRandomCaption(): Promise<string | null> {
    try {
      const captionsPath = path.join(this.contentPath, 'captions.json');
      const captionsData = await fs.promises.readFile(captionsPath, 'utf8');
      const captions = JSON.parse(captionsData) as string[];

      if (captions.length === 0) {
        console.error('[CONTENT SERVICE] No captions available');
        return null;
      }

      const randomIndex = Math.floor(Math.random() * captions.length);
      return captions[randomIndex];
    } catch (error) {
      console.error(`[CONTENT SERVICE] Failed to get random caption: ${error}`);
      return null;
    }
  }

  /**
   * Gets a random hashtag group from the hashtags.json file
   * @returns Promise resolving to a random hashtag group or null if none available
   */
  private async getRandomHashtags(): Promise<string[] | null> {
    try {
      const hashtagsPath = path.join(this.contentPath, 'hashtags.json');
      const hashtagsData = await fs.promises.readFile(hashtagsPath, 'utf8');
      const hashtagGroups = JSON.parse(hashtagsData) as string[][];

      if (hashtagGroups.length === 0) {
        console.error('[CONTENT SERVICE] No hashtag groups available');
        return null;
      }

      const randomIndex = Math.floor(Math.random() * hashtagGroups.length);
      return hashtagGroups[randomIndex];
    } catch (error) {
      console.error(`[CONTENT SERVICE] Failed to get random hashtags: ${error}`);
      return null;
    }
  }

  /**
   * Marks a video as published
   * @param videoPath Path to the published video
   * @param platform Platform where the video was published
   * @returns Promise resolving to true if successful
   */
  async markAsPublished(videoPath: string, platform: string): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = `${videoPath},${platform},${timestamp}\n`;
      
      await fs.promises.appendFile(this.publishedLogPath, logEntry);
      this.publishedVideos.add(videoPath);
      
      console.log(`[CONTENT SERVICE] Marked ${videoPath} as published to ${platform}`);
      return true;
    } catch (error) {
      console.error(`[CONTENT SERVICE] Failed to mark video as published: ${error}`);
      return false;
    }
  }
}
