"use client"

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class WalletErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a wallet-related error
    if (error.name === 'WalletDisconnectedError' || 
        error.message.includes('wallet') || 
        error.message.includes('disconnect')) {
      return { hasError: true, error }
    }
    
    // For other errors, don't catch them
    return { hasError: false }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Wallet Error Boundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    // Reload the page to reset wallet state
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-xl">Wallet Connection Issue</CardTitle>
              <CardDescription>
                There was a problem with your wallet connection. This usually happens when the wallet is disconnected or there's a network issue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">To fix this issue:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Make sure Phantom Wallet is installed and unlocked</li>
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                  <li>Reconnect your wallet if needed</li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}



