import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Profile {
  id: string
  full_name: string
  first_cat: string
}

export default function SocialSidebar() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          full_name,
          first_cat
        `)
        .order('full_name', { ascending: false })
        .limit(10)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full md:w-80 h-screen border-l rounded-none">
      <CardHeader>
        <CardTitle>Miembros Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="space-y-4">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex flex-col gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.first_cat}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      reportes
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}