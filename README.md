# 🎙️ InstaText

*Paste an Instagram Reel link, get the spoken words back as text.*

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)

You find a Reel that's basically a talking-head giving a recipe, a workout, or advice, and you'd rather read it than rewatch it three times. InstaText takes the URL, pulls the video, and hands you a clean transcript you can copy or download.

The API route resolves the Reel's direct video URL with `instagram-url-direct` (three retries, 500ms apart), fetches the file, and sends it to OpenAI's Whisper API (`whisper-1`) for transcription. Since Whisper caps uploads at 25MB, the route checks the download size first and rejects anything larger with a note to try a shorter clip. It also grabs the Reel's thumbnail to show alongside the result.

The front end is a single dark page: paste the URL, hit Generate, and the transcript comes back with a word and character count, a copy button, and a "transcript.txt" download. The "InstaText" wordmark in the navbar uses a small `DecryptedText` component that scrambles the letters through random characters and settles into place on hover, ten iterations at 50ms each.

There's optional password gating in the middleware: set `SITE_PASSWORD` and the API returns 401 without a matching `auth` cookie or header. Page routes are currently let through regardless, so the login side of that is still unfinished.

Built with Next.js 16, React 19, Tailwind 4, and the OpenAI SDK. Live at [instatext-mu.vercel.app](https://instatext-mu.vercel.app/).
