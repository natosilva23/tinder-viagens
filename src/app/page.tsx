'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plane, Heart, Users, MessageCircle, MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 text-5xl md:text-7xl font-bold">
            <Plane className="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              MeetTrip
            </span>
            <Heart className="w-10 h-10 md:w-14 md:h-14 text-pink-500 fill-pink-500" />
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Transforme viagens solo em{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              experiências inesquecíveis
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Conecte-se com viajantes que vão para o mesmo destino nas mesmas datas. 
            Faça amizades reais e torne sua viagem ainda mais especial.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Começar agora
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-lg border-2 hover:bg-white/50"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mesmo destino</h3>
            <p className="text-gray-600">
              Encontre pessoas que vão para o mesmo lugar que você, nas mesmas datas
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Match perfeito</h3>
            <p className="text-gray-600">
              Sistema de likes e matches para garantir conexões mútuas e seguras
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Chat direto</h3>
            <p className="text-gray-600">
              Converse e planeje a viagem juntos antes mesmo de embarcar
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Como funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                1
              </div>
              <h4 className="font-semibold text-gray-900">Crie seu perfil</h4>
              <p className="text-sm text-gray-600">Adicione foto, bio e interesses</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                2
              </div>
              <h4 className="font-semibold text-gray-900">Cadastre sua viagem</h4>
              <p className="text-sm text-gray-600">Destino, datas e estilo de viagem</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                3
              </div>
              <h4 className="font-semibold text-gray-900">Dê likes</h4>
              <p className="text-sm text-gray-600">Veja perfis compatíveis e curta</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">
                4
              </div>
              <h4 className="font-semibold text-gray-900">Converse e viaje!</h4>
              <p className="text-sm text-gray-600">Match feito, planeje juntos</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para sua próxima aventura?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de viajantes que já transformaram suas viagens
          </p>
          <Link href="/signup">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
            >
              Criar conta grátis
              <Users className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
