import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { instagramGetUrl } from "instagram-url-direct";
import { checkRateLimit } from "@/lib/rateLimit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check global rate limit
    const rateLimit = checkRateLimit();

    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          error: "Daily limit reached",
          details: `The app has reached its daily limit of 10 transcriptions. Resets at ${resetDate.toLocaleString()}`
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Download Instagram Reel
    console.log("Downloading from Instagram:", url);
    const result = await instagramGetUrl(url);

    if (!result || !result.url_list || result.url_list.length === 0) {
      throw new Error("Failed to download video from Instagram");
    }

    // Get the video URL
    const videoUrl = result.url_list[0];
    console.log("Video URL:", videoUrl);

    // Fetch the video
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to fetch video");
    }

    const videoBlob = await videoResponse.blob();
    const videoFile = new File([videoBlob], "reel.mp4", { type: "video/mp4" });

    // Send to OpenAI Whisper API
    console.log("Sending to Whisper API...");
    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: "whisper-1",
    });

    return NextResponse.json(
      {
        transcript: transcription.text,
        success: true,
      },
      {
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetTime.toString(),
        }
      }
    );
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: "Failed to transcribe",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
