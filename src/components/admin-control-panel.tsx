"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Users, 
  Image, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

// Mock data
const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active", memes: 15, lastActive: "2 hours ago" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user", status: "active", memes: 8, lastActive: "1 day ago" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "moderator", status: "inactive", memes: 23, lastActive: "3 days ago" },
]

const mockMemes = [
  { id: 1, title: "Doge Meme", author: "Alice Johnson", views: 1250, likes: 89, status: "approved", createdAt: "2025-01-10" },
  { id: 2, title: "Distracted Boyfriend", author: "Bob Smith", views: 2100, likes: 156, status: "pending", createdAt: "2025-01-09" },
  { id: 3, title: "Drake Pointing", author: "Charlie Brown", views: 890, likes: 67, status: "rejected", createdAt: "2025-01-08" },
]

const mockStats = {
  totalUsers: 1247,
  totalMemes: 8934,
  totalViews: 1250000,
  activeUsers: 892,
  pendingApprovals: 23,
  systemHealth: "healthy"
}

export default function AdminControlPanel() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [selectedMeme, setSelectedMeme] = useState<number | null>(null)
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    newUserRegistration: true,
    autoApproveMemes: false,
    maxMemesPerUser: 50,
    maxFileSize: 10
  })

  const handleUserAction = (userId: number, action: string) => {
    console.log(`User ${userId}: ${action}`)
    // Implement user actions
  }

  const handleMemeAction = (memeId: number, action: string) => {
    console.log(`Meme ${memeId}: ${action}`)
    // Implement meme actions
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "inactive": return "bg-gray-500"
      case "banned": return "bg-red-500"
      case "approved": return "bg-green-500"
      case "pending": return "bg-yellow-500"
      case "rejected": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500"
      case "moderator": return "bg-blue-500"
      case "user": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{mockStats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Memes</p>
                <p className="text-2xl font-bold text-foreground">{mockStats.totalMemes.toLocaleString()}</p>
              </div>
              <Image className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{mockStats.totalViews.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-foreground capitalize">{mockStats.systemHealth}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Control Panel */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="memes">Memes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedUser === user.id ? "border-accent bg-accent/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getRoleColor(user.role)} text-white`}>
                              {user.role}
                            </Badge>
                            <Badge className={`${getStatusColor(user.status)} text-white`}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{user.memes} memes</p>
                          <p>Last active: {user.lastActive}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(user.id)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "ban")}>
                            <Shield className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memes Management */}
        <TabsContent value="memes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Meme Moderation
              </CardTitle>
              <CardDescription>
                Review and moderate user-generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMemes.map((meme) => (
                  <div
                    key={meme.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedMeme === meme.id ? "border-accent bg-accent/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{meme.title}</h3>
                          <p className="text-sm text-muted-foreground">by {meme.author}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{meme.views} views</span>
                            <span>{meme.likes} likes</span>
                            <span>{meme.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(meme.status)} text-white`}>
                          {meme.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleMemeAction(meme.id, "approve")}>
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMemeAction(meme.id, "reject")}>
                            <XCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMemeAction(meme.id, "delete")}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">New User Registration</h3>
                    <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                  </div>
                  <Switch
                    checked={systemSettings.newUserRegistration}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, newUserRegistration: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Auto-approve Memes</h3>
                    <p className="text-sm text-muted-foreground">Automatically approve new memes without moderation</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoApproveMemes}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoApproveMemes: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Max Memes Per User</label>
                  <Input
                    type="number"
                    value={systemSettings.maxMemesPerUser}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxMemesPerUser: parseInt(e.target.value) }))}
                    className="max-w-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Max File Size (MB)</label>
                  <Input
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>
                  <Database className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Users (24h)</span>
                    <span className="font-semibold">{mockStats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Registrations</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Approvals</span>
                    <span className="font-semibold text-yellow-600">{mockStats.pendingApprovals}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Database</span>
                    <Badge className="bg-green-500 text-white">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">API Server</span>
                    <Badge className="bg-green-500 text-white">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Storage</span>
                    <Badge className="bg-yellow-500 text-white">75% Full</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}








