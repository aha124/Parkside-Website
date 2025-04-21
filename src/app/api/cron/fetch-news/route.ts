import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Ensure the path to the script is correct relative to the built output
// In Vercel, the scripts directory will likely be at the root level after build
const scriptPath = path.join(process.cwd(), 'scripts', 'fetch-news.js');

export async function GET() {
  console.log('CRON JOB STARTED: Fetching news...');

  return new Promise((resolve) => {
    const nodeProcess = spawn('node', [scriptPath], { stdio: 'pipe' });

    let output = '';
    let errorOutput = '';

    nodeProcess.stdout.on('data', (data) => {
      console.log(`[fetch-news script stdout]: ${data}`);
      output += data.toString();
    });

    nodeProcess.stderr.on('data', (data) => {
      console.error(`[fetch-news script stderr]: ${data}`);
      errorOutput += data.toString();
    });

    nodeProcess.on('close', (code) => {
      console.log(`[fetch-news script] exited with code ${code}`);
      if (code === 0) {
        console.log('CRON JOB SUCCESS: News fetch completed.');
        resolve(NextResponse.json({ success: true, message: 'News fetched successfully.', output }));
      } else {
        console.error('CRON JOB FAILED: News fetch encountered an error.');
        resolve(NextResponse.json({ success: false, message: 'Failed to fetch news.', error: errorOutput, code }, { status: 500 }));
      }
    });

    nodeProcess.on('error', (err) => {
      console.error('CRON JOB FAILED: Failed to start fetch-news script.', err);
      resolve(NextResponse.json({ success: false, message: 'Failed to start script.', error: err.message }, { status: 500 }));
    });
  });
}

// Optional: Add edge runtime configuration if needed, though spawning processes usually requires Node.js runtime
// export const runtime = 'edge'; // Verify if compatible with child_process

// Optional: Add revalidation logic if your pages using news.json are statically generated
// Revalidate the relevant pages after the script runs successfully
// Example: revalidatePath('/news'); 