"use client"

import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { websocketService } from '@/lib/services/websocket'

const ConnectionStatus = () => {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')

  useEffect(() => {
    const handleOpen = () => setStatus('connected')
    const handleClose = () => setStatus('disconnected')
    const handleError = () => setStatus('disconnected')

    websocketService.on('open', handleOpen)
    websocketService.on('close', handleClose)
    websocketService.on('error', handleError)

    return () => {
      websocketService.off('open', handleOpen)
      websocketService.off('close', handleClose)
      websocketService.off('error', handleError)
    }
  }, [])

  return (
    <Badge
      variant={
        status === 'connected'
          ? 'success'
          : status === 'connecting'
          ? 'warning'
          : 'destructive'
      }
      className="fixed bottom-4 right-4 z-50"
    >
      {status === 'connected' && 'Live'}
      {status === 'connecting' && 'Connecting...'}
      {status === 'disconnected' && 'Disconnected'}
    </Badge>
  )
}

export default ConnectionStatus 