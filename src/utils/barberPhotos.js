// Mapa de fotos locales por nombre de barbero (normalizado: minúsculas sin tildes)
// Prioridad: foto local > photo_url de Supabase > inicial

const photos = {
  'andres style':    require('../../assets/barbero1.jpg'),
  'luis barber':    require('../../assets/barbero2.jpg'),
  'carlos fade':   require('../../assets/barbero3.jpg'),
  'miguel pro': require('../../assets/barbero4.jpg'),
}

/**
 * Devuelve el source local para un barbero dado su nombre,
 * o null si no hay foto registrada.
 */
export function getBarberPhoto(name) {
  if (!name) return null
  const key = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes: é→e, ó→o, etc.
    .trim()
  return photos[key] ?? null
}
