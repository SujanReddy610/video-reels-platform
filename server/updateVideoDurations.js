

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from '@ffprobe-installer/ffprobe';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

import './config/db.js';
import Video from './models/Video.js';

// Set paths for ffmpeg & ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

const updateVideoDurations = async () => {
  try {
    const videos = await Video.findAll();
    console.log(`Found ${videos.length} videos.`);

    for (const video of videos) {
      const filePath = path.join(process.cwd(), 'uploads', video.filename);

      try {
        await fs.access(filePath);

        // Get video metadata
        const metadata = await new Promise((resolve, reject) => {
          ffmpeg.ffprobe(filePath, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });

        const duration = Math.floor(metadata.format.duration);
        video.duration = duration;
        await video.save();
        console.log(`✅ Updated video ${video.id} (${video.filename}) duration to ${duration} sec`);
      } catch (fileErr) {
        console.warn(`❌ Error reading file ${video.filename}:`, fileErr.message);
      }
    }

    console.log('All videos processed!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating video durations:', err);
    process.exit(1);
  }
};

updateVideoDurations();
