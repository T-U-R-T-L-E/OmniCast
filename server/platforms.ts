import { GoogleGenAI } from "@google/genai";

/**
 * PRODUCTION-READY INTEGRATION ENGINE FOR MULTI-PLATFORM VIDEO CROSS-POSTING
 * 
 * This module implements real API integrations for TikTok, Instagram Reels,
 * Facebook Reels, and YouTube Shorts. 
 * 
 * To activate these integrations in production, obtain Developer credentials
 * from each platform and declare them in your secure Secrets or .env file.
 */

interface UploadPayload {
  videoUrl: string; // Absolute URL to public storage bucket (required by Meta/TikTok APIs)
  title: string;
  description: string;
  coverUrl?: string;
  settings?: any;
}

// ==========================================
// 1. YOUTUBE SHORTS (Google Data API v3)
// ==========================================
export async function uploadToYouTubeShorts(payload: UploadPayload, accessToken: string) {
  // YouTube requires multi-part resumable upload or public URL download.
  // We use the direct resumable video insert API.
  const metadata = {
    snippet: {
      title: payload.title.substring(0, 100), // Strict 100 char limit
      description: `${payload.description}\n\n#Shorts`,
      tags: ["Shorts", "reels", "viral"],
      categoryId: "22", // People & Blogs
    },
    status: {
      privacyStatus: payload.settings?.visibility || "public", // public, private, or unlisted
      selfDeclaredMadeForKids: false,
    },
  };

  try {
    // Stage 1: Initialize Resumable Session
    const initResponse = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": "video/mp4",
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!initResponse.ok) {
      const errText = await initResponse.text();
      throw new Error(`YouTube Session Init Failed: ${initResponse.status} - ${errText}`);
    }

    // Capture the unique session upload URL
    const uploadUrl = initResponse.headers.get("Location");
    if (!uploadUrl) {
      throw new Error("Failed to receive resumable upload URL from YouTube API.");
    }

    // Stage 2: Transfer video payload from public URL with exponential backoff and retry handling
    const videoDataBuffer = await fetch(payload.videoUrl).then((r) => r.arrayBuffer());
    
    let transferResponse: any = null;
    let retry = 0;
    const MAX_RETRIES = 10;
    const RETRIABLE_STATUS_CODES = [500, 502, 503, 504];

    while (retry <= MAX_RETRIES) {
      try {
        transferResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Length": videoDataBuffer.byteLength.toString(),
          },
          body: videoDataBuffer,
        });

        // Determine if response is completed or retriable
        if (transferResponse.ok) {
          break; // Successfully uploaded
        }

        if (RETRIABLE_STATUS_CODES.includes(transferResponse.status)) {
          console.warn(`[YouTube Upload] Retriable HTTP Error ${transferResponse.status} detected. Retrying...`);
        } else {
          throw new Error(`YouTube Video Bytes Transmission Failed with permanent HTTP Error: ${transferResponse.status} - ${transferResponse.statusText}`);
        }
      } catch (err: any) {
        if (retry === MAX_RETRIES) {
          throw new Error(`YouTube Upload Error: Max retries (${MAX_RETRIES}) reached. ${err.message}`);
        }
        console.error(`[YouTube Upload] Error encountered: ${err.message || String(err)}`);
      }

      retry++;
      const maxSleep = Math.pow(2, retry);
      const sleepSeconds = Math.random() * maxSleep;
      console.log(`[YouTube Upload BACKOFF] Retrying in ${sleepSeconds.toFixed(2)} seconds (Attempt ${retry}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, sleepSeconds * 1000));
    }

    if (!transferResponse || !transferResponse.ok) {
      throw new Error(`YouTube Video Bytes Transmission Failed after backoff retry.`);
    }

    const data = await transferResponse.json();
    return {
      success: true,
      videoId: data.id,
      url: `https://youtube.com/shorts/${data.id}`,
    };
  } catch (error: any) {
    console.error("YouTube Shorts API Error:", error);
    throw error;
  }
}

// ==========================================
// 2. INSTAGRAM REELS (Meta Graph API)
// ==========================================
export async function uploadToInstagramReels(payload: UploadPayload, accessToken: string, igUserId: string) {
  // Meta uses a two-phase Container structure for Instagram video publication.
  // 1. Create a media container housing the target public video file.
  // 2. Poll the status of container generation.
  // 3. Trigger the Publish command.
  try {
    // Stage 1: Initialize Media Container
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: payload.videoUrl,
          caption: payload.description,
          thumb_offset: "1", // Use clip location for coverage frame
          share_to_feed: payload.settings?.postToStory ? "false" : "true",
          access_token: accessToken,
        }),
      }
    );

    const containerData = await containerRes.json();
    if (!containerRes.ok || !containerData.id) {
      throw new Error(`Instagram Media Container Creation Failed: ${JSON.stringify(containerData)}`);
    }

    const containerId = containerData.id;

    // Stage 2: Poll Container until 'FINISHED' status (reels must process on Meta servers)
    let processed = false;
    let attempts = 0;
    while (!processed && attempts < 15) {
      await new Promise((resolve) => setTimeout(resolve, 6000)); // wait 6 seconds
      
      const checkRes = await fetch(
        `https://graph.facebook.com/v19.0/${containerId}?fields=status_code,status&access_token=${accessToken}`
      );
      const checkData = await checkRes.json();
      
      if (checkData.status_code === "FINISHED") {
        processed = true;
      } else if (checkData.status_code === "ERROR") {
        throw new Error(`Meta Video Rendering Error: ${checkData.status}`);
      }
      attempts++;
    }

    if (!processed) {
      throw new Error("Reels media container rendering timed out on Meta cluster.");
    }

    // Stage 3: Publish container package Live
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.id) {
      throw new Error(`Reels Publishing Trigger Failed: ${JSON.stringify(publishData)}`);
    }

    return {
      success: true,
      mediaId: publishData.id,
      url: `https://instagram.com/p/${publishData.id}`,
    };
  } catch (error: any) {
    console.error("Instagram Reels API Error:", error);
    throw error;
  }
}

// ==========================================
// 3. FACEBOOK REELS (Graph API / Page Video)
// ==========================================
export async function uploadToFacebookReels(payload: UploadPayload, accessToken: string, pageId: string) {
  // Similar to Instagram, Facebook uses the page video uploads framework.
  try {
    // Stage 1: Request publishing upload slot
    const initRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/video_reels`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upload_phase: "start",
          access_token: accessToken,
        }),
      }
    );
    const initData = await initRes.json();
    if (!initRes.ok || !initData.video_id) {
      throw new Error(`Facebook Reels Slot Allocation Failed: ${JSON.stringify(initData)}`);
    }

    const videoId = initData.video_id;
    const uploadUrl = initData.upload_url;

    // Stage 2: Transfer binary content to FB upload endpoint
    const videoDataBuffer = await fetch(payload.videoUrl).then((r) => r.arrayBuffer());
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${accessToken}`,
        "file_size": videoDataBuffer.byteLength.toString(),
        "Content-Type": "application/octet-stream",
      },
      body: videoDataBuffer,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.success) {
      throw new Error(`Facebook Reels Chunk Upload Failed: ${JSON.stringify(uploadData)}`);
    }

    // Stage 3: Publish with custom caption overlay
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/video_reels`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upload_phase: "finish",
          video_id: videoId,
          video_state: "PUBLISHED",
          description: payload.description,
          title: payload.title,
          privacy: {
            value: payload.settings?.visibility === "public" ? "EVERYONE" : "SELF",
          },
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();
    return {
      success: true,
      reelId: videoId,
      url: `https://facebook.com/watch/?v=${videoId}`,
    };
  } catch (error: any) {
    console.error("Facebook Reels API Error:", error);
    throw error;
  }
}

// ==========================================
// 4. TIKTOK REELS (TikTok Share/Publishing API)
// ==========================================
export async function uploadToTikTok(payload: UploadPayload, accessToken: string, openId: string) {
  // TikTok uses a secure Direct Post API endpoint
  try {
    const response = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_info: {
          title: payload.title,
          description: payload.description,
          privacy_level: payload.settings?.visibility === "everyone" ? "PUBLIC_TO_EVERYONE" : "MUTUAL_FOLLOWERS_CLAN",
          disable_duet: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: "PULL_FROM_URL",
          video_url: payload.videoUrl, // Requires fully public accessible download link
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(`TikTok Direct Publishing Failed: ${JSON.stringify(data)}`);
    }

    return {
      success: true,
      publishId: data.data?.publish_id,
      url: "https://tiktok.com/publish/status",
    };
  } catch (error: any) {
    console.error("TikTok Publishing API Error:", error);
    throw error;
  }
}
