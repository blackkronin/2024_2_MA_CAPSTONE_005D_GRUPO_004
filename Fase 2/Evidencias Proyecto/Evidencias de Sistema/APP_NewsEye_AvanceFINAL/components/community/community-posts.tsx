import { useState, useEffect } from "react"
import ReactMarkdown from 'react-markdown'
import { supabase } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface Post {
  title: string
  summary: string
  category: string
  date: string
  content: string
  user_id: string
  views_count: number
  likes_count: number
  comments_count: number
}

interface CommunityPostsProps {
  posts: Post[]
  loading: boolean
}

interface User {
  id: string
  full_name: string
}

export default function CommunityPosts({ posts, loading }: CommunityPostsProps) {
  const [users, setUsers] = useState<Map<string, User>>(new Map())
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('usuarios').select('id, full_name')
      if (error) {
        console.error('Error fetching users:', error)
        return
      }
      const usersMap = new Map(data.map((user: User) => [user.id, user]))
      setUsers(usersMap)
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return <div className="text-center py-8">No se encontraron posts en esta categoría.</div>
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Dialog key={index} open={selectedPost === post} onOpenChange={(open) => !open && setSelectedPost(null)}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow duration-300" onClick={() => setSelectedPost(post)}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>
                        {users.get(post.user_id)?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || 'NN'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{users.get(post.user_id)?.full_name || 'Usuario desconocido'}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.date), { 
                          addSuffix: true,
                          locale: es 
                        })}
                      </p>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">{post.views_count}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">{post.likes_count}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{post.comments_count}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="w-[70vw] max-w-[800px] p-4">
              <DialogTitle>{selectedPost?.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mb-4">{selectedPost?.date}</DialogDescription>
              <ScrollArea className="max-h-96">
                <ReactMarkdown>{selectedPost?.content}</ReactMarkdown>
              </ScrollArea>
              <Button variant="outline" className="mt-4" onClick={() => setSelectedPost(null)}>
                Cerrar
              </Button>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}

