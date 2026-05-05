import { useState } from 'react'
import { createAppointment } from '../services/supabaseService'

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const book = async ({ barberId, date, time, clientName, clientPhone }) => {
    setLoading(true)
    setError(null)

    const { data, error } = await createAppointment({
      barber_id: barberId,
      appointment_date: date,
      appointment_time: time,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      status: 'pending',
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }

    return { success: true, appointment: data }
  }

  return { book, loading, error }
}
