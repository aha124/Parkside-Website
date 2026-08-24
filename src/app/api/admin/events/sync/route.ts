import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Kicks off an events sync from parksideharmony.org.
 *
 * The scraping itself lives in the "Update Events from Website" GitHub Action
 * (.github/workflows/update-events.yml), which writes public/data/events.json
 * and commits it. This route only triggers that workflow.
 *
 * It cannot do the scraping inline: /api/events serves events.json out of the
 * deployment bundle, and Vercel's filesystem is read-only outside /tmp. The
 * previous version of this route wrote the file directly, which threw EROFS on
 * every production call — the sync button had never worked once deployed.
 */

const REPO_OWNER = "aha124";
const REPO_NAME = "Parkside-Website";
const WORKFLOW_FILE = "update-events.yml";
const WORKFLOW_REF = "master";

export async function POST() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_SYNC_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Event syncing isn't set up yet. Events still update automatically each night.",
      },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: WORKFLOW_REF }),
      }
    );

    // A successful dispatch returns 204 with no body.
    if (response.status === 204) {
      return NextResponse.json({
        success: true,
        message:
          "Sync started. New events appear in a few minutes, once the site finishes updating.",
      });
    }

    // Log the real reason server-side; show the admin something actionable
    // without leaking token or API details.
    const detail = await response.text().catch(() => "");
    console.error(
      `Events sync dispatch failed: ${response.status} ${response.statusText} ${detail}`
    );

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        {
          error:
            "The sync couldn't be authorized. The access token may have expired or lost permission.",
        },
        { status: 502 }
      );
    }

    if (response.status === 404) {
      return NextResponse.json(
        {
          error:
            "Couldn't find the sync job. It may have been renamed or moved.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Couldn't start the sync. Please try again in a few minutes." },
      { status: 502 }
    );
  } catch (error) {
    console.error("Error dispatching events sync:", error);
    return NextResponse.json(
      { error: "Couldn't reach the sync service. Please try again later." },
      { status: 502 }
    );
  }
}
