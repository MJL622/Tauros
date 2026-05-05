import { useEffect, useState } from 'react'
import { getBarbers } from '../services/supabaseService'

export function useBarbers() {
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBarbers = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getBarbers()
    if (error) setError(error.message)
    else setBarbers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBarbers()
  }, [])

  return { barbers, loading, error, refetch: fetchBarbers }
}
