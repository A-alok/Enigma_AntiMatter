"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Share, CheckCircle } from "lucide-react"

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

interface PostCardProps {
  post: Post
  onLike?: () => void
  onReply?: () => void
  onShare?: () => void
  onReadMore?: () => void
}

export function PostCard({ post, onLike, onReply, onShare, onReadMore }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Author" />
                <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold">{post.author}</h4>
                  {post.verified && <CheckCircle className="w-4 h-4 text-primary" />}
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
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
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
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
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
                className="text-muted-foreground hover:text-blue-500 transition-colors"
                onClick={onReply}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {post.replies}
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
            <Button 
              size="sm" 
              variant="outline" 
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={onReadMore}
            >
              Read More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
