"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { testSupabaseConnection, testMemeTableAccess } from '@/lib/supabase-test'
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2, CheckCircle, XCircle, Database, TestTube } from 'lucide-react'

export default function SupabaseTestButton() {
  const { publicKey, connected } = useWallet()
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const runTests = async () => {
    setIsTesting(true)
    setTestResults(null)
    
    try {
      console.log('🧪 Starting Supabase tests...')
      
      // Test basic connection
      const connectionResult = await testSupabaseConnection()
      console.log('Connection test result:', connectionResult)
      
      let memeTestResult = null
      if (connectionResult.success) {
        // Test meme table access
        memeTestResult = await testMemeTableAccess()
        console.log('Meme table access test result:', memeTestResult)
      }
      
      setTestResults({
        connection: connectionResult,
        memeCreation: memeTestResult,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('Test error:', error)
      setTestResults({
        connection: { success: false, error: 'Test failed' },
        memeCreation: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Supabase Connection Test
        </CardTitle>
        <CardDescription>
          Test Supabase database connection and meme creation functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Run Supabase Tests
            </>
          )}
        </Button>

        {testResults && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Test Results:</h3>
              <Badge variant={testResults.connection?.success ? "default" : "destructive"}>
                {testResults.connection?.success ? "PASSED" : "FAILED"}
              </Badge>
            </div>

            {/* Connection Test Results */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4" />
                <span className="font-medium">Connection Test</span>
                {testResults.connection?.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {testResults.connection?.success 
                  ? testResults.connection.message || 'Connection successful'
                  : testResults.connection?.error || 'Connection failed'
                }
              </p>
            </div>

            {/* Meme Creation Test Results */}
            {testResults.memeCreation && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TestTube className="h-4 w-4" />
                  <span className="font-medium">Meme Creation Test</span>
                  {testResults.memeCreation?.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {testResults.memeCreation?.success 
                    ? 'Meme creation successful'
                    : testResults.memeCreation?.error || 'Meme creation failed'
                  }
                </p>
              </div>
            )}

            {/* Wallet Status */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Wallet Status</span>
                {connected ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {connected 
                  ? `Connected: ${publicKey?.toString().slice(0, 8)}...${publicKey?.toString().slice(-8)}`
                  : 'Wallet not connected - meme creation test skipped'
                }
              </p>
            </div>

            {/* Error Details */}
            {testResults.error && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                <p className="text-sm text-red-700">{testResults.error}</p>
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-muted-foreground">
              Test completed: {new Date(testResults.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}






