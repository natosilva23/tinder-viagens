'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plane, Heart, Compass, MessageCircle, MapPin, User, Menu, X } from 'lucide-react'

const destinations = [
  {
    name: 'Paris',
    country: 'França',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    travelers: 234
  },
  {
    name: 'Tóquio',
    country: 'Japão',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    travelers: 189
  },
  {
    name: 'Nova York',
    country: 'EUA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    travelers: 312
  },
  {
    name: 'Barcelona',
    country: 'Espanha',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
    travelers: 156
  },
  {
    name: 'Bali',
    country: 'Indonésia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    travelers: 201
  },
  {
    name: 'Londres',
    country: 'Inglaterra',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    travelers: 278
  }
]

export default function ExplorePage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/discover" className="flex items-center gap-2 font-bold text-xl">
              <Plane className="w-6 h-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MeetTrip
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/discover">
                <Button variant="ghost" className="gap-2">
                  <Compass className="w-4 h-4" />
                  Descobrir
                </Button>
              </Link>
              <Link href="/matches">
                <Button variant="ghost" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Matches
                </Button>
              </Link>
              <Link href="/trips">
                <Button variant="ghost" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Viagens
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="gap-2">
                  <User className="w-4 h-4" />
                  Perfil
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <Link href="/discover" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Compass className="w-4 h-4" />
                  Descobrir
                </Button>
              </Link>
              <Link href="/matches" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Heart className="w-4 h-4" />
                  Matches
                </Button>
              </Link>
              <Link href="/trips" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <MapPin className="w-4 h-4" />
                  Viagens
                </Button>
              </Link>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="w-4 h-4" />
                  Perfil
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Explore destinos populares
          </h1>
          <p className="text-gray-600 text-lg">
            Veja onde outros viajantes estão indo e encontre sua próxima aventura
          </p>
        </div>

        {/* Grid de destinos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {destinations.map((destination) => (
            <Card
              key={destination.name}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => router.push('/trips/new')}
            >
              <div className="relative h-64">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-white/90 text-sm mb-3">{destination.country}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{destination.travelers} viajantes ativos</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para sua próxima viagem?
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              Crie sua viagem e comece a conectar com viajantes incríveis
            </p>
            <Link href="/trips/new">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white text-purple-600 hover:bg-gray-100"
              >
                Criar viagem agora
                <Plane className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
