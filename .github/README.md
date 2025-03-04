# GitHub Actions Workflows

This directory contains GitHub Actions workflow configurations for the Parkside Website.

## Update Events and News Workflow

The `update-events.yml` workflow automatically fetches the latest events and news from the Parkside Harmony website and updates the JSON data files used by the website.

### Workflow Details

- **Schedule**: Runs daily at midnight (UTC)
- **Triggers**:
  - Scheduled: Every day at midnight
  - Push: When the scraping scripts are modified
  - Manual: Can be triggered manually from the GitHub Actions tab

### What the Workflow Does

1. Checks out the repository code
2. Sets up Node.js environment
3. Installs required dependencies
4. Runs the event scraping script
5. Runs the news fetching script
6. Commits and pushes any changes to the data files

### Manually Triggering the Workflow

To manually trigger the workflow:

1. Go to the GitHub repository
2. Click on the "Actions" tab
3. Select the "Update Events and News from Website" workflow
4. Click "Run workflow" button
5. Select the branch and click "Run workflow"

### Troubleshooting

If the workflow fails:

1. Check the workflow run logs for error messages
2. Verify that the Parkside Harmony website is accessible
3. Check if the HTML structure of the website has changed
4. Update the scraping scripts if necessary

### Local Testing

You can test the scripts locally before pushing changes:

```bash
# For events
node scripts/scrapeEventsPage.js

# For news
node scripts/fetch-news.js
``` 