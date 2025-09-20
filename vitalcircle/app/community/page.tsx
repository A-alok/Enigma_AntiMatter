"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { MessageSquare, Search, Plus, Shield, Bell, TrendingUp } from "lucide-react"
import { PatientNavigation } from "@/components/patient-navigation"
import { ForumCard } from "@/components/forum-card"
import { PostCard } from "@/components/post-card"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostDetailModal } from "@/components/post-detail-modal"

interface Post {
  id: string
  title: string
  author: string
  authorCondition: string
  forum: string
  timestamp: string
  replies: number
  likes: number
  content: string
  tags: string[]
  verified: boolean
  liked?: boolean
}

interface Notification {
  id: string
  type: 'like' | 'reply' | 'mention'
  message: string
  timestamp: string
  read: boolean
}

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [userActivity, setUserActivity] = useState({
    postsCreated: 12,
    repliesGiven: 34,
    helpfulVotes: 45
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [sortBy, setSortBy] = useState("recent")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // Initialize posts from mock data
  useEffect(() => {
    const initialPosts: Post[] = [
      {
        id: "1",
        title: "Finally got my A1C under 7! Here's what worked for me",
        author: "DiabetesWarrior23",
        authorCondition: "Type 2 Diabetes",
        forum: "Type 2 Diabetes Support",
        timestamp: "2 hours ago",
        replies: 23,
        likes: 45,
        content: "After 2 years of struggling, I finally got my A1C from 8.2 to 6.8! The key was consistent meal timing and finding exercises I actually enjoy...",
        tags: ["success-story", "a1c", "lifestyle"],
        verified: true,
        liked: false
      },
      {
        id: "2",
        title: "Low sodium recipes that actually taste good?",
        author: "HeartStrong55",
        authorCondition: "Hypertension",
        forum: "Healthy Eating & Nutrition",
        timestamp: "4 hours ago",
        replies: 18,
        likes: 32,
        content: "My doctor wants me to keep sodium under 2000mg daily, but everything tastes so bland. Anyone have recipes that are both heart-healthy and delicious?",
        tags: ["recipes", "low-sodium", "heart-healthy"],
        verified: false,
        liked: false
      },
      {
        id: "3",
        title: "Dealing with medication side effects - need advice",
        author: "NewToThis2024",
        authorCondition: "Type 2 Diabetes",
        forum: "Type 2 Diabetes Support",
        timestamp: "6 hours ago",
        replies: 15,
        likes: 28,
        content: "Started on Metformin last month and having some digestive issues. My doctor says it's normal but wondering if anyone has tips to manage this better?",
        tags: ["medication", "side-effects", "metformin"],
        verified: false,
        liked: false
      },
      {
        id: "4",
        title: "Home blood pressure monitoring - which device?",
        author: "HealthyGoals",
        authorCondition: "Hypertension",
        forum: "Blood Pressure Management",
        timestamp: "8 hours ago",
        replies: 12,
        likes: 19,
        content: "Doctor recommended home monitoring. There are so many options - looking for recommendations on accurate, easy-to-use devices.",
        tags: ["monitoring", "devices", "blood-pressure"],
        verified: true,
        liked: false
      }
    ]
    setPosts(initialPosts)

    // Add some initial notifications
    const initialNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "like",
        message: "DiabetesWarrior23 liked your post about meal planning",
        timestamp: "2 minutes ago",
        read: false
      },
      {
        id: "notif-2",
        type: "reply",
        message: "Dr. Sarah Wilson replied to your question about A1C levels",
        timestamp: "1 hour ago",
        read: false
      }
    ]
    setNotifications(initialNotifications)
  }, [])

  // Handle post interactions
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
          : post
      )
    )
    toast({
      title: "Post liked!",
      description: "Your interaction has been recorded.",
    })
  }

  const handleCreatePost = (newPostData: { title: string; content: string; forum: string; tags: string[] }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      title: newPostData.title,
      author: "Sarah Johnson",
      authorCondition: "Type 2 Diabetes",
      forum: newPostData.forum,
      timestamp: "Just now",
      replies: 0,
      likes: 0,
      content: newPostData.content,
      tags: newPostData.tags,
      verified: false,
      liked: false
    }
    
    setPosts(prevPosts => [newPost, ...prevPosts])
    setUserActivity(prev => ({ ...prev, postsCreated: prev.postsCreated + 1 }))
    
    toast({
      title: "Post created successfully!",
      description: "Your post has been shared with the community.",
    })
  }

  const handleReplyToPost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, replies: post.replies + 1 }
          : post
      )
    )
    setUserActivity(prev => ({ ...prev, repliesGiven: prev.repliesGiven + 1 }))
    
    toast({
      title: "Reply posted!",
      description: "Your reply has been added to the discussion.",
    })
  }

  const handleViewPost = (post: Post) => {
    setSelectedPost(post)
  }

  const handleSharePost = (postId: string) => {
    toast({
      title: "Link copied!",
      description: "Post link has been copied to your clipboard.",
    })
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update some post metrics to simulate activity
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (Math.random() < 0.1) { // 10% chance to update each post
            return {
              ...post,
              replies: post.replies + Math.floor(Math.random() * 2),
              likes: post.likes + Math.floor(Math.random() * 3)
            }
          }
          return post
        })
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Mock community data - in real app this would come from API
  const communityData = {
    user: {
      name: "Sarah Johnson",
      condition: "Type 2 Diabetes",
      joinDate: "March 2024",
      posts: 12,
      helpfulVotes: 45,
    },
    forums: [
      {
        id: "diabetes",
        name: "Type 2 Diabetes Support",
        description: "Share experiences, tips, and support for managing Type 2 diabetes",
        members: 1247,
        posts: 3421,
        category: "diabetes",
        moderator: "Dr. Sarah Wilson",
        lastActivity: "2 minutes ago",
        trending: true,
      },
      {
        id: "hypertension",
        name: "Blood Pressure Management",
        description: "Discuss strategies for controlling hypertension and heart health",
        members: 892,
        posts: 2156,
        category: "hypertension",
        moderator: "Dr. Michael Chen",
        lastActivity: "15 minutes ago",
        trending: false,
      },
      {
        id: "heart-disease",
        name: "Heart Disease Warriors",
        description: "Support group for those managing various heart conditions",
        members: 634,
        posts: 1789,
        category: "heart-disease",
        moderator: "Dr. Lisa Rodriguez",
        lastActivity: "1 hour ago",
        trending: false,
      },
      {
        id: "nutrition",
        name: "Healthy Eating & Nutrition",
        description: "Share recipes, meal plans, and nutrition tips for chronic conditions",
        members: 2103,
        posts: 5672,
        category: "lifestyle",
        moderator: "Nutritionist Amy Park",
        lastActivity: "5 minutes ago",
        trending: true,
      },
      {
        id: "exercise",
        name: "Exercise & Movement",
        description: "Safe exercise routines and physical activity for chronic conditions",
        members: 1456,
        posts: 3298,
        category: "lifestyle",
        moderator: "PT John Davis",
        lastActivity: "30 minutes ago",
        trending: false,
      },
      {
        id: "mental-health",
        name: "Mental Health & Wellness",
        description: "Emotional support and mental health resources for chronic illness",
        members: 987,
        posts: 2847,
        category: "wellness",
        moderator: "Dr. Jennifer Kim",
        lastActivity: "10 minutes ago",
        trending: false,
      },
    ]
  }

  // Filter forums based on search and category
  const filteredForums = communityData.forums.filter((forum) => {
    const matchesSearch =
      forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || forum.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Filter and sort posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "trending":
        return (b.likes + b.replies) - (a.likes + a.replies)
      case "recent":
      default:
        return new Date(b.timestamp === "Just now" ? Date.now() : Date.parse(b.timestamp)).getTime() - 
               new Date(a.timestamp === "Just now" ? Date.now() : Date.parse(a.timestamp)).getTime()
    }
  })

  // Get user's posts for activity tab
  const userPosts = posts.filter(post => post.author === "Sarah Johnson")

  return (
    <div className="min-h-screen bg-background">
      <PatientNavigation />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Support</h1>
            <p className="text-muted-foreground">
              Connect with others on similar health journeys • Moderated by healthcare professionals
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-red-500">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Guidelines
            </Button>
            <Button size="sm" onClick={() => setShowCreatePost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{communityData.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Managing {communityData.user.condition} • Member since {communityData.user.joinDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{userActivity.postsCreated}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{userActivity.repliesGiven}</div>
                  <div className="text-xs text-muted-foreground">Replies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{userActivity.helpfulVotes}</div>
                  <div className="text-xs text-muted-foreground">Helpful Votes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="forums" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forums">Support Groups</TabsTrigger>
            <TabsTrigger value="recent">Recent Posts</TabsTrigger>
            <TabsTrigger value="my-activity">My Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="forums" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Find Your Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search support groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="hypertension">Hypertension</SelectItem>
                      <SelectItem value="heart-disease">Heart Disease</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Forums Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredForums.map((forum) => (
                <ForumCard key={forum.id} forum={forum} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Community Posts</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar for Posts */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={() => handleLikePost(post.id)}
                    onReply={() => handleReplyToPost(post.id)}
                    onShare={() => handleSharePost(post.id)}
                    onReadMore={() => handleViewPost(post)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search terms or create the first post!</p>
                    <Button onClick={() => setShowCreatePost(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-activity" className="space-y-6">
            {/* Activity Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{userActivity.postsCreated}</div>
                  <div className="text-sm text-muted-foreground">Posts Created</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +2 this week
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">{userActivity.repliesGiven}</div>
                  <div className="text-sm text-muted-foreground">Replies Given</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +5 this week
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">{userActivity.helpfulVotes}</div>
                  <div className="text-sm text-muted-foreground">Helpful Votes</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +8 this week
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Posts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Posts you've created in the community
                </p>
              </CardHeader>
              <CardContent>
                {userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onLike={() => handleLikePost(post.id)}
                        onReply={() => handleReplyToPost(post.id)}
                        onShare={() => handleSharePost(post.id)}
                        onReadMore={() => handleViewPost(post)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any posts yet. Share your experience with the community!
                    </p>
                    <Button onClick={() => setShowCreatePost(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Stay updated with community interactions
                </p>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-muted/50' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                          </div>
                          <Badge 
                            variant={notification.type === 'like' ? 'default' : notification.type === 'reply' ? 'secondary' : 'outline'}
                            className="text-xs ml-2"
                          >
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Post Modal */}
        {showCreatePost && (
          <CreatePostModal 
            onClose={() => setShowCreatePost(false)} 
            onCreatePost={handleCreatePost}
          />
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onLike={() => handleLikePost(selectedPost.id)}
            onReply={() => handleReplyToPost(selectedPost.id)}
            onShare={() => handleSharePost(selectedPost.id)}
          />
        )}
      </main>
    </div>
  )
}
