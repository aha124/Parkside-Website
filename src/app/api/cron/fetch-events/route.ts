import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Ensure the path to the script is correct relative to the built output
const scriptPath = path.join(process.cwd(), 'scripts', 'fetchChoirGeniusEvents.js');

export async function GET(): Promise<Response> {
  console.log('CRON JOB STARTED: Fetching ChoirGenius events...');

  // Check for required environment variables
  const username = process.env.CHOIR_GENIUS_USERNAME;
  const password = process.env.CHOIR_GENIUS_PASSWORD;

  if (!username || !password) {
    console.error('CRON JOB FAILED: Missing CHOIR_GENIUS_USERNAME or CHOIR_GENIUS_PASSWORD environment variables.');
    return NextResponse.json(
      { 
        success: false, 
        message: 'Missing ChoirGenius credentials in environment variables.' 
      }, 
      { status: 500 }
    );
  }

  return new Promise<Response>((resolve) => {
    // Pass environment variables to the child process
    const env = { ...process.env }; 
    const nodeProcess = spawn('node', [scriptPath], { stdio: 'pipe', env });

    let output = '';
    let errorOutput = '';

    nodeProcess.stdout.on('data', (data) => {
      console.log(`[fetchEvents script stdout]: ${data}`);
      output += data.toString();
    });

    nodeProcess.stderr.on('data', (data) => {
      console.error(`[fetchEvents script stderr]: ${data}`);
      errorOutput += data.toString();
    });

    nodeProcess.on('close', (code) => {
      console.log(`[fetchEvents script] exited with code ${code}`);
      // The script might exit with code 0 even on errors (like dummy data generation)
      // Check stderr for specific error messages if needed for more robust error handling
      if (code === 0 && !errorOutput.includes('Error:')) {
        console.log('CRON JOB SUCCESS: Events fetch completed.');
        resolve(NextResponse.json({ success: true, message: 'Events fetched successfully.', output }));
      } else {
        console.error('CRON JOB FAILED: Events fetch encountered an error or used dummy data.');
        resolve(NextResponse.json({ success: false, message: 'Failed to fetch events or used dummy data.', error: errorOutput, code }, { status: 500 }));
      }
    });

    nodeProcess.on('error', (err) => {
      console.error('CRON JOB FAILED: Failed to start fetchEvents script.', err);
      resolve(NextResponse.json({ success: false, message: 'Failed to start script.', error: err.message }, { status: 500 }));
    });
  });
}

// Optional: Add revalidation logic if your pages using events.json are statically generated
// Example: revalidatePath('/events'); 