import { useState } from 'react'
import { getAvailableSlots } from '../services/supabaseService'

export function useSlots() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSlots = async (barberId, date) => {
    if (!barberId || !date) return
    setLoading(true)
    setError(null)
    const { data, error } = await getAvailableSlots(barberId, date)
    if (error) setError(error.message)
    else setSlots(data || [])
    setLoading(false)
  }

  const clearSlots = () => setSlots([])

  return { slots, loading, error, fetchSlots, clearSlots }
}
