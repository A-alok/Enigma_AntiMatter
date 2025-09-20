"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageSquare, Share, CheckCircle, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

interface Reply {
  id: string
  author: string
  authorCondition: string
  content: string
  timestamp: string
  likes: number
  verified: boolean
  liked?: boolean
}

interface PostDetailModalProps {
  post: Post
  onClose: () => void
  onLike?: () => void
  onReply?: (content: string) => void
  onShare?: () => void
}

export function PostDetailModal({ post, onClose, onLike, onReply, onShare }: PostDetailModalProps) {
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState<Reply[]>([
    {
      id: "reply-1",
      author: "Dr. Sarah Wilson",
      authorCondition: "Endocrinologist",
      content: "This is great progress! Consistent meal timing is indeed one of the most effective strategies. The key is finding a routine that works with your lifestyle.",
      timestamp: "1 hour ago",
      likes: 12,
      verified: true,
      liked: false
    },
    {
      id: "reply-2",
      author: "HealthyGoals",
      authorCondition: "Type 2 Diabetes",
      content: "Congratulations! I'm still working on getting mine under 7. What time do you usually eat your meals?",
      timestamp: "45 minutes ago",
      likes: 5,
      verified: false,
      liked: false
    }
  ])

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return

    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      author: "Sarah Johnson",
      authorCondition: "Type 2 Diabetes",
      content: replyContent.trim(),
      timestamp: "Just now",
      likes: 0,
      verified: false,
      liked: false
    }

    setReplies([...replies, newReply])
    setReplyContent("")
    
    if (onReply) {
      onReply(replyContent.trim())
    }
  }

  const handleLikeReply = (replyId: string) => {
    setReplies(prevReplies =>
      prevReplies.map(reply =>
        reply.id === replyId
          ? { ...reply, likes: reply.liked ? reply.likes - 1 : reply.likes + 1, liked: !reply.liked }
          : reply
      )
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Post Discussion</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Original Post */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                      <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{post.author}</h3>
                        {post.verified && <CheckCircle className="w-5 h-5 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.authorCondition} • {post.timestamp}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {post.forum}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`transition-colors ${
                      post.liked 
                        ? "text-red-500 hover:text-red-600" 
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                    onClick={onLike}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${post.liked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {replies.length}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-green-500 transition-colors"
                    onClick={onShare}
                  >
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reply Input */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Add a reply</h4>
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts or experiences..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        size="sm" 
                        onClick={handleSubmitReply}
                        disabled={!replyContent.trim()}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{replies.length} Replies</h4>
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Author" />
                        <AvatarFallback>{reply.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium">{reply.author}</h5>
                          {reply.verified && <CheckCircle className="w-4 h-4 text-primary" />}
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{reply.authorCondition}</p>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`h-8 px-2 text-xs transition-colors ${
                              reply.liked 
                                ? "text-red-500 hover:text-red-600" 
                                : "text-muted-foreground hover:text-red-500"
                            }`}
                            onClick={() => handleLikeReply(reply.id)}
                          >
                            <Heart className={`w-3 h-3 mr-1 ${reply.liked ? "fill-current" : ""}`} />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
