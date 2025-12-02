'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, X, MapPin, Calendar, Users, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Profile {
  id: string
  name: string
  age: number
  bio: string | null
  photo_url: string | null
  interests: string[]
}

interface Trip {
  id: string
  destination: string
  start_date: string
  end_date: string
  travel_style: string[]
  user_id: string
}

interface TravelerCard {
  profile: Profile
  trip: Trip
}

export default function DiscoverPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [travelers, setTravelers] = useState<TravelerCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    loadTravelers()
  }

  const loadTravelers = async () => {
    try {
      // Buscar viagens ativas do usuário
      const { data: userTrips } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', (await getCurrentUser())?.id)
        .eq('status', 'active')

      if (!userTrips || userTrips.length === 0) {
        toast.info('Crie uma viagem primeiro para ver viajantes compatíveis!')
        router.push('/trips/new')
        return
      }

      const userTrip = userTrips[0]

      // Buscar viajantes compatíveis (mesmo destino, datas sobrepostas)
      const { data: compatibleTrips } = await supabase
        .from('trips')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('destination', userTrip.destination)
        .eq('status', 'active')
        .neq('user_id', (await getCurrentUser())?.id)

      // Buscar swipes já feitos
      const { data: existingSwipes } = await supabase
        .from('swipes')
        .select('target_user_id')
        .eq('user_id', (await getCurrentUser())?.id)

      const swipedIds = existingSwipes?.map(s => s.target_user_id) || []

      // Filtrar viajantes não swipados
      const filtered = compatibleTrips
        ?.filter((trip: any) => !swipedIds.includes(trip.user_id))
        .map((trip: any) => ({
          profile: trip.profiles,
          trip: trip
        })) || []

      setTravelers(filtered)
    } catch (error) {
      console.error('Erro ao carregar viajantes:', error)
      toast.error('Erro ao carregar viajantes')
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (!currentUser || travelers.length === 0) return

    const currentTraveler = travelers[currentIndex]

    try {
      // Registrar swipe
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          user_id: currentUser.id,
          target_user_id: currentTraveler.profile.id,
          trip_id: currentTraveler.trip.id,
          action
        })

      if (swipeError) throw swipeError

      // Se foi like, verificar se houve match
      if (action === 'like') {
        const { data: reverseSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('user_id', currentTraveler.profile.id)
          .eq('target_user_id', currentUser.id)
          .eq('action', 'like')
          .single()

        if (reverseSwipe) {
          setMatchedUser(currentTraveler.profile)
          setShowMatch(true)
          toast.success('É um match! 🎉')
        }
      }

      // Próximo card
      setCurrentIndex(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao processar swipe:', error)
      toast.error('Erro ao processar ação')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Carregando viajantes...</p>
        </div>
      </div>
    )
  }

  const currentTraveler = travelers[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-md py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Descubra viajantes
          </h1>
          <p className="text-gray-600">
            {travelers.length - currentIndex} perfis compatíveis
          </p>
        </div>

        {/* Card */}
        {currentTraveler ? (
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-2xl">
              {/* Foto */}
              <div className="relative h-96 bg-gray-200">
                <Image
                  src={currentTraveler.profile.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop'}
                  alt={currentTraveler.profile.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {currentTraveler.profile.name}, {currentTraveler.profile.age}
                  </h2>
                  <p className="text-white/90 text-sm">
                    {currentTraveler.profile.bio || 'Sem bio'}
                  </p>
                </div>
              </div>

              {/* Info da viagem */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{currentTraveler.trip.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">
                    {new Date(currentTraveler.trip.start_date).toLocaleDateString('pt-BR')} - {new Date(currentTraveler.trip.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {currentTraveler.trip.travel_style.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {currentTraveler.trip.travel_style.map((style, i) => (
                        <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {currentTraveler.profile.interests.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {currentTraveler.profile.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Botões de ação */}
            <div className="flex justify-center gap-6">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-red-500 hover:bg-red-50"
                onClick={() => handleSwipe('pass')}
              >
                <X className="w-8 h-8 text-red-500" />
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                onClick={() => handleSwipe('like')}
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sem mais viajantes por agora
            </h3>
            <p className="text-gray-600 mb-6">
              Volte mais tarde para ver novos perfis compatíveis!
            </p>
            <Button onClick={() => router.push('/trips')}>
              Ver minhas viagens
            </Button>
          </Card>
        )}
      </div>

      {/* Match Modal */}
      {showMatch && matchedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-8 text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              É um Match!
            </h2>
            <p className="text-gray-600 mb-6">
              Você e {matchedUser.name} curtiram um ao outro!
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowMatch(false)
                  setMatchedUser(null)
                }}
              >
                Continuar explorando
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
                onClick={() => router.push('/matches')}
              >
                Ver matches
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
