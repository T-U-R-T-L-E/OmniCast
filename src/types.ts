export interface ConnectedAccount {
  id: string;
  platform: "tiktok" | "instagram" | "facebook" | "youtube_shorts";
  username: string;
  avatarUrl: string;
  connected: boolean;
  status: "active" | "expired" | "not_connected";
}

export interface PlatformOptimization {
  tiktok: {
    final_caption: string;
  };
  instagram: {
    caption: string;
  };
  facebook: {
    caption: string;
  };
  youtube_shorts: {
    title: string;
    description: string;
  };
}

export interface OptimizedResult {
  analytics_keywords: string[];
  platforms: PlatformOptimization;
}

export interface CrossPost {
  id: string;
  title: string;
  description: string;
  hashtags: string;
  videoUrl: string | null;
  videoName: string | null;
  videoSize: string | null;
  thumbnailUrl: string;
  platforms: {
    tiktok: boolean;
    instagram: boolean;
    facebook: boolean;
    youtube_shorts: boolean;
  };
  customCaptions?: {
    tiktok?: string;
    instagram?: string;
    facebook?: string;
    youtube_shorts_title?: string;
    youtube_shorts_description?: string;
  };
  youtubeSettings?: {
    saveOrPublish: string;
    visibility: string;
    coverUrl: string;
  };
  tiktokSettings?: {
    visibility: string;
    coverUrl: string;
  };
  instagramSettings?: {
    postToStory: boolean;
    coverUrl: string;
  };
  facebookSettings?: {
    shareToStory: boolean;
    visibility: string;
    coverUrl: string;
  };
  status: "draft" | "queued" | "publishing" | "published" | "failed";
  publishDate: string;
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface PublishingStep {
  name: string;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
}
