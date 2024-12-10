"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import CommunityPosts from "@/components/community/community-posts"
import SocialSidebar from "@/components/community/social-sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: "all", label: "Todos los Posts" },
    { id: "conocimiento", label: "Conocimiento" },
    { id: "profesion", label: "Profesión" },
    { id: "para_mi", label: "Para Mí" },
  ]

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const folders = ['conocimiento', 'profesion', 'para_mi']
      const allPosts = []

      const { data: users, error: usersError } = await supabase.from('usuarios').select('id')
      if (usersError) throw usersError

      for (const user of users) {
        for (const folder of folders) {
          const folderPath = `reports_user_${user.id}/${folder}`
          const { data, error } = await supabase.storage.from("reportes.usuarios").list(folderPath, {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "desc" },
          })

          if (error) throw error

          const postsData = await Promise.all(
            data
              .filter(file => file.name.endsWith('.json'))
              .map(async (file) => {
                const { data: fileData, error: fileError } = await supabase.storage.from("reportes.usuarios").download(`${folderPath}/${file.name}`)
                if (fileError) throw fileError
                const text = await fileData.text()
                const post = JSON.parse(text)
                post.category = folder // Add category to post
                return post
              })
          )

          allPosts.push(...postsData)
        }
      }

      setPosts(allPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Comunidad</h1>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Skeleton key={index} className="h-48 w-full" />
                    ))}
                  </div>
                ) : (
                  <CommunityPosts 
                    posts={posts.filter(post => 
                      (selectedCategory === 'all' || post.category === selectedCategory) &&
                      (searchQuery ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                    )}
                    loading={loading}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <SocialSidebar />
    </div>
  )
}

