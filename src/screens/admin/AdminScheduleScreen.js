import { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { getAllBarbers, getScheduleByBarber, upsertSchedule } from '../../services/supabaseService'
import { globalStyles, COLORS } from '../../styles/globalStyles'

const DAYS = [
  { key: 1, label: 'Lunes' },
  { key: 2, label: 'Martes' },
  { key: 3, label: 'Miércoles' },
  { key: 4, label: 'Jueves' },
  { key: 5, label: 'Viernes' },
  { key: 6, label: 'Sábado' },
  { key: 0, label: 'Domingo' },
]

const DEFAULT_SCHEDULE = DAYS.map((d) => ({
  day_of_week: d.key,
  start_time: '09:00',
  end_time: '18:00',
  slot_duration: 30,
  is_active: d.key >= 1 && d.key <= 5,
}))

export default function AdminScheduleScreen() {
  const [barbers, setBarbers] = useState([])
  const [selectedBarber, setSelectedBarber] = useState(null)
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadBarbers() }, [])

  useEffect(() => {
    if (selectedBarber) loadSchedule(selectedBarber.id)
  }, [selectedBarber])

  const loadBarbers = async () => {
    const { data, error } = await getAllBarbers()
    if (error) { Alert.alert('Error', error.message); setLoading(false); return }
    const list = data || []
    setBarbers(list)
    if (list.length > 0) setSelectedBarber(list[0])
    setLoading(false)
  }

  const loadSchedule = async (barberId) => {
    setLoading(true)
    const { data } = await getScheduleByBarber(barberId)
    if (data && data.length > 0) {
      const merged = DEFAULT_SCHEDULE.map((def) => {
        const found = data.find((d) => d.day_of_week === def.day_of_week)
        return found ? { ...def, ...found } : def
      })
      setSchedule(merged)
    } else {
      setSchedule(DEFAULT_SCHEDULE)
    }
    setLoading(false)
  }

  const updateDay = (dayKey, field, value) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day_of_week === dayKey ? { ...d, [field]: value } : d))
    )
  }

  const handleSave = async () => {
    if (!selectedBarber) return
    setSaving(true)
    const payload = schedule.map((d) => ({ ...d, barber_id: selectedBarber.id }))
    const { error } = await upsertSchedule(payload)
    setSaving(false)
    if (error) Alert.alert('Error', error.message)
    else Alert.alert('Guardado', 'Horarios actualizados correctamente.')
  }

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    )
  }

  return (
    <View style={globalStyles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Horarios</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? '...' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Barber selector — chips horizontales, sin Picker */}
      <View style={styles.barberSection}>
        <Text style={styles.sectionLabel}>Selecciona barbero</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {barbers.map((b) => {
            const active = selectedBarber?.id === b.id
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedBarber(b)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Schedule list */}
      <ScrollView contentContainerStyle={styles.list}>
        {DAYS.map((day) => {
          const dayData = schedule.find((d) => d.day_of_week === day.key)
          if (!dayData) return null
          return (
            <View key={day.key} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayLabel}>{day.label}</Text>
                <Switch
                  value={!!dayData.is_active}
                  onValueChange={(v) => updateDay(day.key, 'is_active', v)}
                  trackColor={{ false: '#444', true: COLORS.gold + '88' }}
                  thumbColor={dayData.is_active ? COLORS.gold : '#888'}
                />
              </View>
              {dayData.is_active && (
                <View style={styles.timeRow}>
                  <View style={styles.timeField}>
                    <Text style={styles.timeLabel}>Inicio</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={dayData.start_time}
                      onChangeText={(v) => updateDay(day.key, 'start_time', v)}
                      placeholder="09:00"
                      placeholderTextColor="#555"
                    />
                  </View>
                  <Text style={styles.timeSep}>–</Text>
                  <View style={styles.timeField}>
                    <Text style={styles.timeLabel}>Fin</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={dayData.end_time}
                      onChangeText={(v) => updateDay(day.key, 'end_time', v)}
                      placeholder="18:00"
                      placeholderTextColor="#555"
                    />
                  </View>
                  <View style={styles.timeField}>
                    <Text style={styles.timeLabel}>Min</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={dayData.slot_duration?.toString()}
                      onChangeText={(v) => updateDay(day.key, 'slot_duration', parseInt(v) || 30)}
                      keyboardType="number-pad"
                      placeholder="30"
                      placeholderTextColor="#555"
                    />
                  </View>
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  saveBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: {
    color: COLORS.bg,
    fontWeight: 'bold',
    fontSize: 14,
  },
  barberSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.bg,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  dayCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  timeField: { flex: 1 },
  timeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timeInput: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  timeSep: {
    color: COLORS.textSecondary,
    fontSize: 18,
    paddingBottom: 8,
  },
})
