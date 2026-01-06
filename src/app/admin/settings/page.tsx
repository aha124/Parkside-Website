import { ExternalLink, Github, Database, Image, Key } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configuration and setup information
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded-lg">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 22.525H0l12-21.05 12 21.05z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vercel Dashboard</h3>
              <p className="text-sm text-gray-500">Manage deployments and settings</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </a>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-900 rounded-lg">
              <Github className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">GitHub Repository</h3>
              <p className="text-sm text-gray-500">View source code and issues</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </a>
      </div>

      {/* Environment Variables Guide */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Required Environment Variables
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            These environment variables must be set in Vercel for the admin
            dashboard to work:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100">
{`# Authentication (NextAuth.js)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-random-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Initial admin emails (comma-separated)
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Vercel KV (auto-configured in Vercel)
KV_URL=your-kv-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-rest-api-token
KV_REST_API_READ_ONLY_TOKEN=your-kv-readonly-token

# Vercel Blob (auto-configured in Vercel)
BLOB_READ_WRITE_TOKEN=your-blob-token`}
            </pre>
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Database className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Vercel KV</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Redis-based key-value store for news, events, videos, and admin
            user data.
          </p>
          <a
            href="https://vercel.com/docs/storage/vercel-kv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
          >
            View Documentation <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Image className="w-5 h-5 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Vercel Blob</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            File storage for uploaded images. All uploads are served via
            Vercel&apos;s CDN.
          </p>
          <a
            href="https://vercel.com/docs/storage/vercel-blob"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
          >
            View Documentation <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">
          Initial Setup Instructions
        </h3>
        <ol className="text-blue-800 text-sm space-y-3 list-decimal list-inside">
          <li>
            <strong>Create OAuth Apps:</strong> Set up OAuth applications in{" "}
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Cloud Console
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/settings/developers"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              GitHub Developer Settings
            </a>
          </li>
          <li>
            <strong>Configure Vercel Storage:</strong> In your Vercel project,
            add KV and Blob storage from the Storage tab
          </li>
          <li>
            <strong>Set Environment Variables:</strong> Add all required
            variables in Vercel project settings
          </li>
          <li>
            <strong>Add Initial Admins:</strong> Set ADMIN_EMAILS with your
            email to get initial access
          </li>
          <li>
            <strong>Deploy:</strong> Push changes to trigger a new deployment
          </li>
        </ol>
      </div>
    </div>
  );
}
