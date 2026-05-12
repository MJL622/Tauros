import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Cliente público — para todas las operaciones
export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Admins ──────────────────────────────────────────────────────────────────

/**
 * Verifica credenciales del admin via RPC (accesible para anon)
 * Retorna { data: [{id, name, email}] | [], error }
 */
export const verifyAdmin = async (email, password) => {
  return await supabase.rpc('verify_admin_password', {
    p_email: email.trim().toLowerCase(),
    p_password: password,
  })
}

export const getAdmins = async () => {
  return await supabase.from('admins').select('id, name, email, is_active, created_at').order('name')
}

export const createAdmin = async ({ name, email, password }) => {
  return await supabase.rpc('create_admin', {
    p_name: name.trim(),
    p_email: email.trim().toLowerCase(),
    p_password: password,
  })
}

export const updateAdminStatus = async (id, is_active) => {
  return await supabase.from('admins').update({ is_active }).eq('id', id)
}

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

// ─── Time Blocks (bloqueos puntuales de disponibilidad) ──────────────────────

export const getTimeBlocks = async (barberId, date) => {
  let query = supabase
    .from('time_blocks')
    .select('*')
    .eq('barber_id', barberId)
  if (date) {
    // Filtrar bloques que intersecten con el día seleccionado
    query = query
      .lte('start_datetime', `${date}T23:59:59`)
      .gte('end_datetime', `${date}T00:00:00`)
  }
  return await query
}

export const createTimeBlock = async ({ barberId, startDatetime, endDatetime, reason }) => {
  return await supabase.from('time_blocks').insert([{
    barber_id: barberId,
    start_datetime: startDatetime,
    end_datetime: endDatetime,
    reason: reason ?? null,
  }]).select().single()
}

export const deleteTimeBlock = async (id) => {
  return await supabase.from('time_blocks').delete().eq('id', id)
}

// ─── Slots ───────────────────────────────────────────────────────────────────

export const getAvailableSlots = async (barberId, date) => {
  return await supabase.rpc('get_available_slots', {
    p_barber_id: barberId,
    p_date: date,
    p_duration_minutes: 60,
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

export const deleteOldAppointments = async () => {
  const today = new Date().toISOString().split('T')[0]
  // Elimina citas cuya fecha ya pasó (anteriores a hoy)
  return await supabase
    .from('appointments')
    .delete()
    .lt('appointment_date', today)
}
