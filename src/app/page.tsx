"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranscribe = async () => {
    if (!url) {
      setError("Please enter an Instagram Reel URL");
      return;
    }

    setLoading(true);
    setError("");
    setTranscript("");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to transcribe");
      }

      setTranscript(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <main className="w-full max-w-3xl">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h1 className="mb-2 text-center text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            InstaText
          </h1>
          <p className="mb-8 text-center text-gray-600">
            Paste an Instagram Reel URL to get an instant transcript
          </p>

          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Reel URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-4 text-lg transition-colors focus:border-pink-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading && url) {
                    handleTranscribe();
                  }
                }}
              />
            </div>

            {/* Transcribe Button */}
            <button
              onClick={handleTranscribe}
              disabled={loading || !url}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Transcribing..." : "Transcribe"}
            </button>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Transcript
                  </h2>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-700"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={downloadTranscript}
                    className="flex-1 rounded-lg bg-pink-600 px-4 py-3 font-medium text-white transition-colors hover:bg-pink-700"
                  >
                    Download as TXT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
