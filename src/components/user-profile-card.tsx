"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  Wallet,
  Settings,
  Globe,
  Bell,
  Palette
} from "lucide-react"
import { useUser } from "@/hooks/use-user"
import type { UserProfile } from "@/lib/user-service"

export default function UserProfileCard() {
  const { user, loading, updateProfile, username, bio, preferences } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UserProfile>({
    username: username || '',
    bio: bio || '',
    preferences: preferences || {
      theme: 'dark',
      notifications: true,
      public_profile: true
    }
  })

  const handleSave = async () => {
    const success = await updateProfile(editData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      username: username || '',
      bio: bio || '',
      preferences: preferences || {
        theme: 'dark',
        notifications: true,
        public_profile: true
      }
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No profile data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Manage your profile and preferences
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Username</label>
            {isEditing ? (
              <Input
                value={editData.username || ''}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                placeholder="Enter your username"
                className="mt-1"
              />
            ) : (
              <div className="mt-1 text-foreground">
                {username || 'No username set'}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            {isEditing ? (
              <Textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="mt-1"
                rows={3}
              />
            ) : (
              <div className="mt-1 text-muted-foreground">
                {bio || 'No bio set'}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Wallet Information</label>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">
              {user.wallet_type}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              {user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-8)}
            </span>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Account Information</label>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined: {new Date(user.first_connected_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last active: {new Date(user.last_active_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.is_active ? "default" : "secondary"}>
                {user.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Preferences */}
        {isEditing && (
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Preferences</label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">Theme</span>
                </div>
                <select
                  value={editData.preferences?.theme || 'dark'}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      theme: e.target.value as 'light' | 'dark' | 'auto'
                    }
                  })}
                  className="bg-background border border-border rounded-md px-2 py-1 text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={editData.preferences?.notifications || false}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      notifications: e.target.checked
                    }
                  })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Public Profile</span>
                </div>
                <input
                  type="checkbox"
                  checked={editData.preferences?.public_profile || false}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      public_profile: e.target.checked
                    }
                  })}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}






