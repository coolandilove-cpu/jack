"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Database } from "lucide-react"

export default function SupabaseConfigAlert() {
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isConfigured) {
    return null
  }

  return (
    <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Supabase Configuration Required</AlertTitle>
      <AlertDescription className="text-yellow-600">
        To enable user profiles and data storage, please create a <code className="bg-yellow-500/20 px-1 rounded">.env.local</code> file in the project root with:
        <br />
        <code className="block mt-2 p-2 bg-black/20 rounded text-sm">
          NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url<br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        </code>
        <br />
        <strong>How to get these values:</strong>
        <br />
        1. Go to <a href="https://supabase.com" target="_blank" className="text-blue-400 underline">supabase.com</a>
        <br />
        2. Create a new project or select existing project
        <br />
        3. Go to Settings → API
        <br />
        4. Copy the Project URL and anon/public key
        <br />
        5. Paste them in your .env.local file
        <br />
        <br />
        Without this configuration, the profile page will work in demo mode only.
      </AlertDescription>
    </Alert>
  )
}
