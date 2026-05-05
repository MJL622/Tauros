import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Barbers ────────────────────────────────────────────────────────────────

export const getBarbers = async () => {
  return await supabase.from('barbers').select('*').eq('is_active', true)
}

export const getAllBarbers = async () => {
  return await supabase.from('barbers').select('*').order('name')
}

export const createBarber = async (data) => {
  return await supabase.from('barbers').insert([data]).select().single()
}

export const updateBarber = async (id, data) => {
  return await supabase.from('barbers').update(data).eq('id', id).select().single()
}

export const deleteBarber = async (id) => {
  return await supabase.from('barbers').delete().eq('id', id)
}

// ─── Schedules ──────────────────────────────────────────────────────────────

export const getScheduleByBarber = async (barberId) => {
  return await supabase
    .from('schedules')
    .select('*')
    .eq('barber_id', barberId)
    .order('day_of_week')
}

export const upsertSchedule = async (data) => {
  return await supabase.from('schedules').upsert(data, { onConflict: 'barber_id,day_of_week' })
}

// ─── Slots ───────────────────────────────────────────────────────────────────

export const getAvailableSlots = async (barberId, date) => {
  return await supabase.rpc('get_available_slots', {
    p_barber_id: barberId,
    p_date: date,
    p_duration_minutes: 30,
  })
}

// ─── Appointments ────────────────────────────────────────────────────────────

export const createAppointment = async (data) => {
  return await supabase.from('appointments').insert([data]).select().single()
}

export const getAppointments = async ({ date, barberId } = {}) => {
  let query = supabase
    .from('appointments')
    .select('*, barbers(name)')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  if (date) query = query.eq('appointment_date', date)
  if (barberId && barberId !== 'all') query = query.eq('barber_id', barberId)

  return await query
}

export const updateAppointmentStatus = async (id, status) => {
  return await supabase.from('appointments').update({ status }).eq('id', id)
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const adminLogin = async (password) => {
  return await supabase.auth.signInWithPassword({
    email: process.env.EXPO_PUBLIC_ADMIN_EMAIL,
    password,
  })
}

export const adminLogout = async () => {
  return await supabase.auth.signOut()
}
