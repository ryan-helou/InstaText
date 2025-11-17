import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { instagramGetUrl } from "instagram-url-direct";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Download Instagram Reel
    const result = await instagramGetUrl(url);

    if (!result || !result.url_list || result.url_list.length === 0) {
      throw new Error("Failed to download video from Instagram");
    }

    // Get the video URL and thumbnail
    const videoUrl = result.url_list[0];

    // Get thumbnail from media_details array
    const thumbnailUrl = result.media_details?.[0]?.thumbnail || null;

    // Fetch the video
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video");
    }

    const videoBlob = await videoResponse.blob();

    // Check file size (OpenAI Whisper has 25MB limit)
    const fileSizeMB = videoBlob.size / (1024 * 1024);
    if (fileSizeMB > 25) {
      throw new Error(`Video file is too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 25MB. Try a shorter video.`);
    }

    const videoFile = new File([videoBlob], "reel.mp4", { type: "video/mp4" });

    // Send to OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: "whisper-1",
    });

    return NextResponse.json({
      transcript: transcription.text,
      thumbnail: thumbnailUrl,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to transcribe",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
