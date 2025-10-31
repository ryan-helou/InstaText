"use client";

import { useState } from "react";
import DecryptedText from "@/components/DecryptedText";

export default function Home() {
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [thumbnail, setThumbnail] = useState("");

  const handleTranscribe = async () => {
    if (!url) {
      setError("Please enter an Instagram Reel URL");
      return;
    }

    if (!password) {
      setError("Please enter the access password");
      return;
    }

    setLoading(true);
    setError("");
    setTranscript("");
    setThumbnail("");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to transcribe");
      }

      setTranscript(data.transcript);
      setThumbnail(data.thumbnail || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const clearTranscript = () => {
    setTranscript("");
    setUrl("");
    setPassword("");
    setError("");
    setThumbnail("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-pink-500/20 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative border-b border-white/5 bg-black/30 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/50">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 blur-lg opacity-50"></div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  <DecryptedText text="InstaText" />
                </span>
                <div className="text-xs text-gray-500">by Ryan Helou</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl sm:flex">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 backdrop-blur-xl">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>AI-Powered Transcription</span>
          </div>
          <h1 className="mb-6 text-6xl font-bold leading-tight text-white sm:text-7xl lg:text-8xl">
            Transform<br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Instagram Reels</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path d="M1 9C50 3 100 1 150 3C200 5 250 9 299 5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />into Text
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 sm:text-2xl">
            Instantly transcribe any Instagram Reel with state-of-the-art AI.
            Fast, accurate, and effortless.
          </p>
        </div>

        {/* Main Card */}
        <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-1 transition-all duration-300 hover:border-white/20">
          <div className="rounded-[1.3rem] bg-gradient-to-br from-black/40 to-black/60 p-8 backdrop-blur-2xl">
            <div className="space-y-6">
              {/* URL Input */}
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Instagram Reel URL
                </label>
                <div className="group/input relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 blur transition-opacity duration-300 group-focus-within/input:opacity-100"></div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    className="relative w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg text-white placeholder-gray-500 backdrop-blur-xl transition-all duration-300 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading && url && password) {
                        handleTranscribe();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <svg className="h-4 w-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Access Password
                </label>
                <div className="group/input relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 blur transition-opacity duration-300 group-focus-within/input:opacity-100"></div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access password"
                    className="relative w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg text-white placeholder-gray-500 backdrop-blur-xl transition-all duration-300 focus:border-pink-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading && url && password) {
                        handleTranscribe();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Transcribe Button */}
              <button
                onClick={handleTranscribe}
                disabled={loading || !url || !password}
                className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <div className="relative rounded-[0.9rem] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-6 py-5">
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-bold text-white">
                    {loading ? (
                      <>
                        <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Magic...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate Transcript</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"></div>
                </div>
              </button>

            {/* Error Message */}
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 p-5 backdrop-blur-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/20">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold text-red-300">Error</h3>
                      <p className="text-sm leading-relaxed text-red-200/80">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-1">
                  <div className="rounded-[0.9rem] bg-black/40 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                          <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">Transcript Ready</h2>
                          <p className="text-sm text-gray-400">{transcript.split(' ').length} words · {Math.ceil(transcript.length / 5)} characters</p>
                        </div>
                      </div>
                      <button
                        onClick={clearTranscript}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Thumbnail Preview */}
                    {thumbnail && (
                      <div className="mb-5">
                        <img
                          src={thumbnail}
                          alt="Reel thumbnail"
                          className="w-full max-w-xs mx-auto rounded-xl border border-white/10"
                        />
                      </div>
                    )}

                    <div className="custom-scrollbar max-h-96 overflow-y-auto rounded-xl bg-black/40 p-5 ring-1 ring-white/5">
                      <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-200">
                        {transcript}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="group/copy relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:from-white/15 hover:to-white/10"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {copied ? (
                        <>
                          <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-semibold text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 text-gray-300 transition-transform group-hover/copy:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold text-white">Copy Text</span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={downloadTranscript}
                    className="group/download relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:from-white/15 hover:to-white/10"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 text-gray-300 transition-transform group-hover/download:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="font-semibold text-white">Download</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-7 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition-all duration-300 group-hover:bg-purple-500/20"></div>
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/20">
                <svg className="h-7 w-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Lightning Fast</h3>
              <p className="text-sm leading-relaxed text-gray-400">Process any Reel in seconds with our optimized pipeline</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-7 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl transition-all duration-300 group-hover:bg-pink-500/20"></div>
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 ring-1 ring-pink-500/20">
                <svg className="h-7 w-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">AI-Powered</h3>
              <p className="text-sm leading-relaxed text-gray-400">Advanced speech recognition using OpenAI Whisper</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-7 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20"></div>
            <div className="relative">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/20">
                <svg className="h-7 w-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Private & Secure</h3>
              <p className="text-sm leading-relaxed text-gray-400">Your data is processed securely and never stored</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-gray-500">
            Built by Ryan Helou
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Powered by Next.js, Tailwind CSS, and OpenAI Whisper
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}

