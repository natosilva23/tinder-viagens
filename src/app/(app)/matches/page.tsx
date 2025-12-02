'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, MapPin, Calendar, Heart } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Match {
  id: string
  created_at: string
  user1_id: string
  user2_id: string
  trip_id: string
  other_user: {
    id: string
    name: string
    photo_url: string | null
  }
  trip: {
    destination: string
    start_date: string
    end_date: string
  }
  unread_count: number
}

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    loadMatches(user.id)
  }

  const loadMatches = async (userId: string) => {
    try {
      // Buscar matches do usuário
      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          *,
          trip:trip_id (destination, start_date, end_date)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Para cada match, buscar info do outro usuário
      const enrichedMatches = await Promise.all(
        (matchesData || []).map(async (match) => {
          const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id
          
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, name, photo_url')
            .eq('id', otherUserId)
            .single()

          // Contar mensagens não lidas
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('match_id', match.id)
            .eq('read', false)
            .neq('sender_id', userId)

          return {
            ...match,
            other_user: otherUser,
            unread_count: count || 0
          }
        })
      )

      setMatches(enrichedMatches)
    } catch (error) {
      console.error('Erro ao carregar matches:', error)
      toast.error('Erro ao carregar matches')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Carregando matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Seus Matches
          </h1>
          <p className="text-gray-600">
            {matches.length} {matches.length === 1 ? 'conexão' : 'conexões'}
          </p>
        </div>

        {/* Lista de matches */}
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Link key={match.id} href={`/chat/${match.id}`}>
                <Card className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={match.other_user.photo_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                        {match.other_user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {match.other_user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{match.trip.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(match.trip.start_date).toLocaleDateString('pt-BR')} - {new Date(match.trip.end_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                      {match.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {match.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum match ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece a dar likes para encontrar viajantes compatíveis!
            </p>
            <Button 
              onClick={() => router.push('/discover')}
              className="bg-gradient-to-r from-pink-600 to-purple-600"
            >
              Descobrir viajantes
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
