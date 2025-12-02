'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plane, Heart } from 'lucide-react'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    bio: '',
    photoUrl: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        age: parseInt(formData.age),
        bio: formData.bio,
        photo_url: formData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop'
      })
      
      if (error) throw error
      
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold">
            <Plane className="w-10 h-10 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MeetTrip
            </span>
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </div>
          <CardTitle className="text-2xl">Crie sua conta</CardTitle>
          <CardDescription>
            Comece sua jornada de viagens conectadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                min="18"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (opcional)</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoUrl">URL da foto (opcional)</Label>
              <Input
                id="photoUrl"
                type="url"
                placeholder="https://..."
                value={formData.photoUrl}
                onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
