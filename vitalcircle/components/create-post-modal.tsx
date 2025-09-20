"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface CreatePostModalProps {
  onClose: () => void
  onCreatePost?: (postData: { title: string; content: string; forum: string; tags: string[] }) => void
}

export function CreatePostModal({ onClose, onCreatePost }: CreatePostModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedForum, setSelectedForum] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const forums = [
    { id: "diabetes", name: "Type 2 Diabetes Support" },
    { id: "hypertension", name: "Blood Pressure Management" },
    { id: "heart-disease", name: "Heart Disease Warriors" },
    { id: "nutrition", name: "Healthy Eating & Nutrition" },
    { id: "exercise", name: "Exercise & Movement" },
    { id: "mental-health", name: "Mental Health & Wellness" },
  ]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim() || !selectedForum) {
      return // Basic validation
    }
    
    // Handle post creation
    const postData = {
      title: title.trim(),
      content: content.trim(),
      forum: forums.find(f => f.id === selectedForum)?.name || selectedForum,
      tags: tags
    }
    
    if (onCreatePost) {
      onCreatePost(postData)
    }
    
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your experience, ask questions, or offer support to the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="forum">Select Support Group</Label>
            <Select value={selectedForum} onValueChange={setSelectedForum} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a support group" />
              </SelectTrigger>
              <SelectContent>
                {forums.map((forum) => (
                  <SelectItem key={forum.id} value={forum.id}>
                    {forum.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, experiences, or questions..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Community Guidelines Reminder</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be respectful and supportive to all community members</li>
              <li>• Share experiences, not medical advice</li>
              <li>• Protect your privacy - avoid sharing personal health details</li>
              <li>• Posts are moderated by healthcare professionals</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
