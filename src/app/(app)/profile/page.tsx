'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser, signOut } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { LogOut, User, Globe, Heart } from 'lucide-react'
import { toast } from 'sonner'

const LANGUAGES = [
  'Português', 'Inglês', 'Espanhol', 'Francês', 
  'Alemão', 'Italiano', 'Japonês', 'Mandarim'
]

const INTERESTS = [
  'Fotografia', 'Esportes', 'Arte', 'Música', 
  'Culinária', 'História', 'Compras', 'Vida noturna',
  'Natureza', 'Aventura', 'Cultura', 'Praia'
]

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    age: 0,
    bio: '',
    photo_url: '',
    languages: [] as string[],
    interests: [] as string[]
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    loadProfile(user.id)
  }

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        setProfile({
          name: data.name,
          age: data.age,
          bio: data.bio || '',
          photo_url: data.photo_url || '',
          languages: data.languages || [],
          interests: data.interests || []
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      toast.error('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          age: profile.age,
          bio: profile.bio,
          photo_url: profile.photo_url,
          languages: profile.languages,
          interests: profile.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error)
      toast.error(error.message || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    toast.success('Logout realizado com sucesso')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meu Perfil
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile.photo_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="w-full space-y-2">
                <Label htmlFor="photo_url">URL da foto</Label>
                <Input
                  id="photo_url"
                  type="url"
                  placeholder="https://..."
                  value={profile.photo_url}
                  onChange={(e) => setProfile({...profile, photo_url: e.target.value})}
                />
              </div>
            </div>

            {/* Info básica */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Nome
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
              />
            </div>

            {/* Idiomas */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                Idiomas que falo
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${language}`}
                      checked={profile.languages.includes(language)}
                      onCheckedChange={() => 
                        setProfile({
                          ...profile, 
                          languages: toggleArrayItem(profile.languages, language)
                        })
                      }
                    />
                    <label
                      htmlFor={`lang-${language}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Interesses */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                Meus interesses
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={`int-${interest}`}
                      checked={profile.interests.includes(interest)}
                      onCheckedChange={() => 
                        setProfile({
                          ...profile, 
                          interests: toggleArrayItem(profile.interests, interest)
                        })
                      }
                    />
                    <label
                      htmlFor={`int-${interest}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview dos badges */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Preview do perfil</Label>
              <div className="space-y-2">
                {profile.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang, i) => (
                      <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                )}
                {profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary" className="bg-pink-100 text-pink-700">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botão salvar */}
            <Button 
              onClick={handleSave}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
