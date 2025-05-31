# Video Publisher System

A multi-platform short-form video publishing system that automates the publishing of vertical short-form videos (Instagram Reels, TikTok, YouTube Shorts, X) using Sprout Social's API.

## Overview

This system allows you to:
- Schedule and publish videos across multiple social media platforms
- Support multiple products, each mapped to one or more platforms
- Schedule and randomize up to 8 posts per day per platform per product
- Configure everything via a centralized JSON config system

## Project Structure

```
/video-publisher-system/
├── src/
│   ├── publishers/         # Platform-specific publishers
│   │   └── InstagramPublisher.ts
│   ├── services/           # Core services
│   │   ├── ConfigService.ts
│   │   ├── ContentService.ts
│   │   ├── Logger.ts
│   │   ├── PublishingService.ts
│   │   └── SchedulerService.ts
│   ├── interfaces/         # Common interfaces
│   │   └── ISocialPublisher.ts
│   ├── types/              # Type definitions
│   │   ├── ProductConfig.ts
│   │   └── VideoContent.ts
│   └── index.ts            # Entry point
├── config/                 # Configuration files
│   └── products.config.json
├── logs/                   # Log files
├── test-content/           # Test content
│   └── wonderbaby/
│       ├── video1.mp4
│       ├── captions.json
│       └── hashtags.json
├── package.json
└── tsconfig.json
```

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Build the project:
   ```
   npx tsc
   ```

3. Run the application:
   ```
   node dist/index.js
   ```

## Configuration

The system is configured via the `config/products.config.json` file. Each product has its own configuration with platform-specific settings.

Example configuration:
```json
{
  "wonderbaby": {
    "platforms": {
      "instagram": {
        "accountId": "ig_account_id",
        "postsPerDay": 8,
        "postTimes": ["09:00", "11:30", "14:00", "16:00", "17:30", "19:00", "20:30", "22:00"]
      },
      "tiktok": {
        "accountId": "tt_account_id",
        "postsPerDay": 5,
        "postTimes": ["10:00", "13:00", "15:30", "18:00", "21:00"]
      }
    },
    "contentPath": "/path/to/content/wonderbaby"
  }
}
```

## Content Structure

Each product folder should contain:
- Video files (e.g., video1.mp4, video2.mp4)
- captions.json - Array of captions
- hashtags.json - Array of hashtag groups (arrays of strings)

## Future Extensions

The system is designed to be extensible for future features:
- Real Sprout integration for Instagram, TikTok, YouTube, and X
- Retry logic on failure
- Error alerting
- Priority-based scheduling

## Current Limitations

- This initial phase includes a placeholder publisher for Instagram only
- No real Sprout API integration yet - just simulates it
- Logs payloads that would be sent to the API
