'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, MapPin, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const TRAVEL_STYLES = [
  'Aventura', 'Relaxamento', 'Cultural', 'Gastronômico', 
  'Festa', 'Natureza', 'Urbano', 'Praia'
]

const INTERESTS = [
  'Fotografia', 'Esportes', 'Arte', 'Música', 
  'Culinária', 'História', 'Compras', 'Vida noturna'
]

export default function NewTripPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    destination: '',
    destinationCountry: '',
    travelStyle: [] as string[],
    interests: [] as string[]
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
      router.push('/login')
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!startDate || !endDate) {
      toast.error('Selecione as datas da viagem')
      return
    }

    setLoading(true)

    try {
      const user = await getCurrentUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          destination: formData.destination,
          destination_country: formData.destinationCountry,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          travel_style: formData.travelStyle,
          interests: formData.interests,
          status: 'active'
        })

      if (error) throw error

      toast.success('Viagem criada com sucesso!')
      router.push('/discover')
    } catch (error: any) {
      console.error('Erro ao criar viagem:', error)
      toast.error(error.message || 'Erro ao criar viagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Criar nova viagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destino */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Cidade de destino
                </Label>
                <Input
                  id="destination"
                  placeholder="Paris, Londres, Tóquio..."
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  placeholder="França, Inglaterra, Japão..."
                  value={formData.destinationCountry}
                  onChange={(e) => setFormData({...formData, destinationCountry: e.target.value})}
                  required
                  className="h-12"
                />
              </div>

              {/* Datas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de ida</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy') : 'Selecione'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        locale={ptBR}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data de volta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy') : 'Selecione'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        locale={ptBR}
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Estilo de viagem */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Estilo de viagem
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {TRAVEL_STYLES.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={style}
                        checked={formData.travelStyle.includes(style)}
                        onCheckedChange={() => 
                          setFormData({
                            ...formData, 
                            travelStyle: toggleArrayItem(formData.travelStyle, style)
                          })
                        }
                      />
                      <label
                        htmlFor={style}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interesses */}
              <div className="space-y-3">
                <Label>Interesses</Label>
                <div className="grid grid-cols-2 gap-3">
                  {INTERESTS.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => 
                          setFormData({
                            ...formData, 
                            interests: toggleArrayItem(formData.interests, interest)
                          })
                        }
                      />
                      <label
                        htmlFor={interest}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Criando viagem...' : 'Criar viagem'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
