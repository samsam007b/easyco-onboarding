'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/auth/supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Hook for typing indicators in conversations
 * Uses Supabase Broadcast for real-time typing status
 */

interface TypingUser {
  userId: string
  userName: string
}

export function useTypingIndicator(conversationId: string | null, userId: string | null) {
  const supabase = createClient()
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Subscribe to typing events
  useEffect(() => {
    if (!conversationId || !userId) {
      return
    }

    const channelName = `typing:${conversationId}`

    const typingChannel = supabase.channel(channelName)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user_id, user_name, is_typing } = payload.payload

        // Ignore own typing events
        if (user_id === userId) return

        setTypingUsers((prev) => {
          if (is_typing) {
            // Add user to typing list if not already there
            if (!prev.find(u => u.userId === user_id)) {
              return [...prev, { userId: user_id, userName: user_name }]
            }
            return prev
          } else {
            // Remove user from typing list
            return prev.filter(u => u.userId !== user_id)
          }
        })
      })
      .subscribe()

    setChannel(typingChannel)

    // Cleanup on unmount
    return () => {
      typingChannel.unsubscribe()
      setChannel(null)
      setTypingUsers([])
    }
  }, [conversationId, userId, supabase])

  // Send typing indicator
  const setTyping = useCallback(
    async (isTyping: boolean, userName: string) => {
      if (!channel || !userId || !conversationId) return

      try {
        // Broadcast typing status
        await channel.send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            user_id: userId,
            user_name: userName,
            is_typing: isTyping,
          },
        })

        // Also update database for persistence (optional)
        if (isTyping) {
          await supabase
            .from('typing_indicators')
            .upsert({
              conversation_id: conversationId,
              user_id: userId,
              updated_at: new Date().toISOString(),
            })
        } else {
          await supabase
            .from('typing_indicators')
            .delete()
            .eq('conversation_id', conversationId)
            .eq('user_id', userId)
        }
      } catch (error) {
        console.error('Error sending typing indicator:', error)
      }
    },
    [channel, userId, conversationId, supabase]
  )

  // Handle typing with auto-stop after 3 seconds
  const startTyping = useCallback(
    async (userName: string) => {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Send typing = true
      await setTyping(true, userName)

      // Auto-stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false, userName)
      }, 3000)
    },
    [setTyping]
  )

  // Manually stop typing
  const stopTyping = useCallback(
    async (userName: string) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
      await setTyping(false, userName)
    },
    [setTyping]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return {
    typingUsers,
    startTyping,
    stopTyping,
    isAnyoneTyping: typingUsers.length > 0,
  }
}

/**
 * Format typing indicator text
 */
export function getTypingText(typingUsers: TypingUser[]): string {
  if (typingUsers.length === 0) return ''
  if (typingUsers.length === 1) return `${typingUsers[0].userName} is typing...`
  if (typingUsers.length === 2) return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`
  return `${typingUsers.length} people are typing...`
}
