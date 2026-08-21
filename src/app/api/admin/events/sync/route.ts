import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// The scraping + commit pipeline lives in the `update-events.yml` GitHub Action
// (scripts/syncEvents.js). That is the durable source of truth: it commits
// public/data/events.json to the repo, which is bundled at build time and read
// at request time by /api/events.
//
// This route used to scrape and `fs.writeFileSync` public/data/events.json at
// request time. On Vercel the serverless filesystem is ephemeral, so those
// writes reported success but silently vanished on the next cold start/redeploy.
// Instead of duplicating (and losing) the sync, the admin button now triggers
// the same GitHub Action via workflow_dispatch so the result actually persists.

const GITHUB_API = "https://api.github.com";
const WORKFLOW_FILE = "update-events.yml";

export async function POST() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GH_WORKFLOW_TOKEN;
  const repo = process.env.GH_REPO || "aha124/parkside-website";
  const ref = process.env.GH_WORKFLOW_REF || "main";

  if (!token) {
    return NextResponse.json(
      {
        error:
          "In-app sync is not configured. Set GH_WORKFLOW_TOKEN (a token with " +
          "actions:write on this repo) to enable it, or trigger the " +
          '"Update Events from Website" GitHub Action manually.',
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${repo}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref }),
      }
    );

    // GitHub returns 204 No Content on a successful dispatch.
    if (!res.ok) {
      console.error(
        `Failed to dispatch events sync workflow (status ${res.status})`
      );
      return NextResponse.json(
        { error: "Failed to trigger sync. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      triggered: true,
      message:
        "Event sync triggered. The latest events will appear on the site " +
        "within a few minutes, once the sync finishes and the site redeploys.",
    });
  } catch (error) {
    console.error("Error triggering events sync:", error);
    return NextResponse.json(
      { error: "Failed to trigger sync. Please try again later." },
      { status: 500 }
    );
  }
}
