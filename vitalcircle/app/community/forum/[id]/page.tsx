"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, MessageSquare, Search, Plus, Flag, Shield } from "lucide-react"
import Link from "next/link"
import { PatientNavigation } from "@/components/patient-navigation"
import { PostCard } from "@/components/post-card"

export default function ForumDetailPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  // Mock forum data - in real app this would be fetched based on params.id
  const forumData = {
    id: "diabetes",
    name: "Type 2 Diabetes Support",
    description: "Share experiences, tips, and support for managing Type 2 diabetes",
    members: 1247,
    posts: 3421,
    moderator: "Dr. Sarah Wilson",
    rules: [
      "Share experiences, not medical advice",
      "Be respectful and supportive",
      "No promotional content",
      "Protect your privacy",
    ],
    pinnedPosts: [
      {
        id: "pinned-1",
        title: "Welcome to Type 2 Diabetes Support - Start Here!",
        author: "Dr. Sarah Wilson",
        authorCondition: "Moderator",
        forum: "Type 2 Diabetes Support",
        timestamp: "Pinned",
        replies: 156,
        likes: 234,
        content:
          "Welcome to our supportive community! This is a safe space to share experiences, ask questions, and support each other...",
        tags: ["welcome", "guidelines"],
        verified: true,
        pinned: true,
      },
    ],
    posts: [
      {
        id: "1",
        title: "Finally got my A1C under 7! Here's what worked for me",
        author: "DiabetesWarrior23",
        authorCondition: "Type 2 Diabetes",
        forum: "Type 2 Diabetes Support",
        timestamp: "2 hours ago",
        replies: 23,
        likes: 45,
        content:
          "After 2 years of struggling, I finally got my A1C from 8.2 to 6.8! The key was consistent meal timing and finding exercises I actually enjoy. Here's my routine...",
        tags: ["success-story", "a1c", "lifestyle"],
        verified: true,
      },
      {
        id: "2",
        title: "Dealing with medication side effects - need advice",
        author: "NewToThis2024",
        authorCondition: "Type 2 Diabetes",
        forum: "Type 2 Diabetes Support",
        timestamp: "6 hours ago",
        replies: 15,
        likes: 28,
        content:
          "Started on Metformin last month and having some digestive issues. My doctor says it's normal but wondering if anyone has tips to manage this better?",
        tags: ["medication", "side-effects", "metformin"],
        verified: false,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientNavigation />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/community">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Link>
          </Button>
        </div>

        {/* Forum Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{forumData.name}</CardTitle>
                <CardDescription className="mt-2">{forumData.description}</CardDescription>
                <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {forumData.members.toLocaleString()} members
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {forumData.posts.toLocaleString()} posts
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Moderated by {forumData.moderator}
                  </div>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="replies">Most Replies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pinned Posts */}
            {forumData.pinnedPosts.map((post) => (
              <div key={post.id} className="relative">
                <Badge className="absolute -top-2 left-4 z-10 bg-primary">Pinned</Badge>
                <PostCard post={post} />
              </div>
            ))}

            {/* Regular Posts */}
            <div className="space-y-4">
              {forumData.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Forum Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Forum Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {forumData.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">{index + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Post
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Moderator
                </Button>
              </CardContent>
            </Card>

            {/* Active Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["DiabetesWarrior23", "HealthyGoals", "NewToThis2024"].map((member) => (
                    <div key={member} className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{member.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
