'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Trip {
  id: string
  destination: string
  destination_country: string
  start_date: string
  end_date: string
  travel_style: string[]
  status: string
  match_count: number
}

export default function TripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
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
    loadTrips(user.id)
  }

  const loadTrips = async (userId: string) => {
    try {
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false })

      if (error) throw error

      // Para cada viagem, contar matches
      const enrichedTrips = await Promise.all(
        (tripsData || []).map(async (trip) => {
          const { count } = await supabase
            .from('matches')
            .select('*', { count: 'exact', head: true })
            .eq('trip_id', trip.id)

          return {
            ...trip,
            match_count: count || 0
          }
        })
      )

      setTrips(enrichedTrips)
    } catch (error) {
      console.error('Erro ao carregar viagens:', error)
      toast.error('Erro ao carregar viagens')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta viagem?')) return

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId)

      if (error) throw error

      toast.success('Viagem excluída com sucesso')
      setTrips(trips.filter(t => t.id !== tripId))
    } catch (error) {
      console.error('Erro ao excluir viagem:', error)
      toast.error('Erro ao excluir viagem')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Carregando viagens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Minhas Viagens
            </h1>
            <p className="text-gray-600 mt-1">
              {trips.length} {trips.length === 1 ? 'viagem' : 'viagens'}
            </p>
          </div>
          <Link href="/trips/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova viagem
            </Button>
          </Link>
        </div>

        {/* Lista de viagens */}
        {trips.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {trip.destination}
                      </h3>
                      <p className="text-sm text-gray-600">{trip.destination_country}</p>
                    </div>
                    <Badge
                      variant={trip.status === 'active' ? 'default' : 'secondary'}
                      className={trip.status === 'active' ? 'bg-green-500' : ''}
                    >
                      {trip.status === 'active' ? 'Ativa' : trip.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </Badge>
                  </div>

                  {/* Datas */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>
                      {new Date(trip.start_date).toLocaleDateString('pt-BR')} - {new Date(trip.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Estilo de viagem */}
                  {trip.travel_style.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trip.travel_style.map((style, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Matches */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-pink-600" />
                    <span className="text-gray-700">
                      {trip.match_count} {trip.match_count === 1 ? 'match' : 'matches'}
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push('/discover')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Ver viajantes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma viagem cadastrada
            </h3>
            <p className="text-gray-600 mb-6">
              Crie sua primeira viagem para começar a encontrar viajantes!
            </p>
            <Link href="/trips/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira viagem
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
