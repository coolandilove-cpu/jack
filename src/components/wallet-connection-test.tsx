"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, Database, Users, Wallet } from 'lucide-react'
import { testWalletConnectionFlow, checkWalletInDatabase, getAllUsers } from '@/lib/test-wallet-connection'
import { useWallet } from '@solana/wallet-adapter-react'

export default function WalletConnectionTest() {
  const { connected, publicKey } = useWallet()
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [walletCheck, setWalletCheck] = useState<any>(null)
  const [allUsers, setAllUsers] = useState<any>(null)

  const runConnectionTest = async () => {
    setIsTesting(true)
    try {
      const results = await testWalletConnectionFlow()
      setTestResults(results)
    } catch (error) {
      setTestResults({ success: false, error: 'Test failed' })
    } finally {
      setIsTesting(false)
    }
  }

  const checkCurrentWallet = async () => {
    if (!publicKey) return
    
    try {
      const result = await checkWalletInDatabase(publicKey.toString())
      setWalletCheck(result)
    } catch (error) {
      setWalletCheck({ exists: false, error: 'Check failed' })
    }
  }

  const loadAllUsers = async () => {
    try {
      const result = await getAllUsers()
      setAllUsers(result)
    } catch (error) {
      setAllUsers({ success: false, error: 'Load failed' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connection Test
          </CardTitle>
          <CardDescription>
            Test wallet connection and Supabase integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={connected ? "default" : "secondary"}>
              {connected ? "Connected" : "Not Connected"}
            </Badge>
            {publicKey && (
              <Badge variant="outline">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={runConnectionTest} 
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Test Connection Flow
                </>
              )}
            </Button>

            <Button 
              onClick={checkCurrentWallet} 
              disabled={!connected}
              variant="outline"
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Check Current Wallet
            </Button>

            <Button 
              onClick={loadAllUsers} 
              variant="outline"
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Load All Users
            </Button>
          </div>

          {/* Test Results */}
          {testResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {testResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Connection Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Wallet Check Results */}
          {walletCheck && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {walletCheck.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Current Wallet Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Exists in Database:</strong> {walletCheck.exists ? 'Yes' : 'No'}</p>
                  {walletCheck.user && (
                    <div>
                      <p><strong>User ID:</strong> {walletCheck.user.id}</p>
                      <p><strong>Wallet Type:</strong> {walletCheck.user.wallet_type}</p>
                      <p><strong>First Connected:</strong> {new Date(walletCheck.user.first_connected_at).toLocaleString()}</p>
                      <p><strong>Last Active:</strong> {new Date(walletCheck.user.last_active_at).toLocaleString()}</p>
                    </div>
                  )}
                  {walletCheck.error && (
                    <p className="text-red-500"><strong>Error:</strong> {walletCheck.error}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Users */}
          {allUsers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users in Database ({allUsers.users?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allUsers.success ? (
                  <div className="space-y-2">
                    {allUsers.users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.wallet_type} • {new Date(user.first_connected_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">Error: {allUsers.error}</p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}






