# Demo Video for Aura Presence

## Video Requirements

To add a demo video for testing without a camera, place a video file here:

**Path:** `frontend/public/demo-video.mp4`

### Video Specifications

- **Duration:** 30-60 seconds (will loop)
- **Resolution:** 640x480 or higher
- **Format:** MP4 (H.264)
- **Content:** Person facing camera, ideally showing:
  - Clear face (for Face Mesh detection)
  - Upper body (for Pose detection)
  - Visible hands (for Hands detection)
  - Some movement (gestures, head movement, blinking)

### Recommended Sources for License-Free Videos

1. **Pexels** - https://www.pexels.com/search/videos/person%20talking/
   - Search: "person talking", "presentation", "interview"
   - License: Free to use

2. **Pixabay** - https://pixabay.com/videos/
   - Search: "person speaking", "video call"
   - License: Free for commercial use

3. **Videvo** - https://www.videvo.net/
   - Free stock footage with various licenses

### How to Download and Add Video

1. Visit one of the recommended sources
2. Search for a suitable video (person facing camera)
3. Download in MP4 format
4. Rename to `demo-video.mp4`
5. Place in `frontend/public/` folder

### Example ffmpeg Command (if conversion needed)

```bash
ffmpeg -i input-video.mov -vcodec h264 -acodec aac -vf scale=640:480 demo-video.mp4
```

## Usage in App

Once the video is added:

1. Start the app: `npm run dev`
2. Navigate to Analysis page
3. Toggle "Demo-Video" instead of "Live-Kamera"
4. The video will play in a loop for testing

## Current Status

⚠️ **No demo video currently present**

The app will display an error if "Demo-Video" mode is selected without a video file.

To use MediaPipe analysis, either:
- Add a demo video as described above
- Use "Live-Kamera" mode (requires webcam access)

