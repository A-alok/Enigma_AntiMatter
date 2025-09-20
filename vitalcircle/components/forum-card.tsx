"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, TrendingUp, Shield, Clock } from "lucide-react"
import Link from "next/link"

interface Forum {
  id: string
  name: string
  description: string
  members: number
  posts: number
  category: string
  moderator: string
  lastActivity: string
  trending: boolean
}

interface ForumCardProps {
  forum: Forum
}

export function ForumCard({ forum }: ForumCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {forum.name}
              {forum.trending && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">{forum.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {forum.members.toLocaleString()} members
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                {forum.posts.toLocaleString()} posts
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="w-4 h-4 mr-1" />
              Moderated by {forum.moderator}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {forum.lastActivity}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs">
              {forum.category.replace("-", " ")}
            </Badge>
            <Button size="sm" asChild>
              <Link href={`/community/forum/${forum.id}`}>Join Discussion</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
