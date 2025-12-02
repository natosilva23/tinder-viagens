'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

interface MatchInfo {
  other_user: {
    id: string
    name: string
    photo_url: string | null
  }
  trip: {
    destination: string
  }
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string
  
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadChat()
      subscribeToMessages()
    }
  }, [currentUser, matchId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAuth = async () => {
    const user = await getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
  }

  const loadChat = async () => {
    try {
      // Buscar info do match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select(`
          user1_id,
          user2_id,
          trip:trip_id (destination)
        `)
        .eq('id', matchId)
        .single()

      if (matchError) throw matchError

      const otherUserId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id

      const { data: otherUser } = await supabase
        .from('profiles')
        .select('id, name, photo_url')
        .eq('id', otherUserId)
        .single()

      setMatchInfo({
        other_user: otherUser,
        trip: match.trip
      })

      // Buscar mensagens
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      setMessages(messagesData || [])

      // Marcar mensagens como lidas
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .neq('sender_id', currentUser.id)
        .eq('read', false)

    } catch (error) {
      console.error('Erro ao carregar chat:', error)
      toast.error('Erro ao carregar conversa')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          
          // Marcar como lida se não for do usuário atual
          if (payload.new.sender_id !== currentUser?.id) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: currentUser.id,
          content: newMessage.trim()
        })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Carregando conversa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {matchInfo && (
              <>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={matchInfo.other_user.photo_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {matchInfo.other_user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {matchInfo.other_user.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {matchInfo.trip.destination}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl px-4 py-6 space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === currentUser?.id
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                    {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 h-12"
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
