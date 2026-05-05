import { useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSlots } from '../hooks/useSlots'
import TimeSlotButton from '../components/TimeSlotButton'
import { globalStyles, COLORS } from '../styles/globalStyles'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return `${DAY_NAMES[date.getDay()]} ${day} de ${MONTH_NAMES[month - 1]}`
}

export default function TimeSlotScreen({ route, navigation }) {
  const { barber, date } = route.params
  const { slots, loading, error, fetchSlots } = useSlots()

  useEffect(() => {
    fetchSlots(barber.id, date)
  }, [barber.id, date])

  const handleSlotPress = (slot) => {
    navigation.navigate('Booking', { barber, date, time: slot.slot_time })
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.barberName}>{barber.name}</Text>
        <Text style={styles.dateLabel}>{formatDate(date)}</Text>
      </View>

      <Text style={styles.sectionLabel}>Elige una hora</Text>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>Error al cargar horarios: {error}</Text>
      )}

      {!loading && !error && slots.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No hay horarios disponibles para este día.</Text>
        </View>
      )}

      {!loading && slots.length > 0 && (
        <>
          <View style={styles.slotsGrid}>
            {slots.map((slot, i) => (
              <TimeSlotButton
                key={i}
                slot={slot}
                onPress={() => slot.is_available && handleSlotPress(slot)}
              />
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { borderColor: COLORS.available, backgroundColor: COLORS.card }]} />
              <Text style={styles.legendText}>Disponible</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { borderColor: COLORS.border, backgroundColor: '#2a2a2a' }]} />
              <Text style={styles.legendText}>Ocupado</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  barberName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  dateLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.cancelled,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
  legend: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
})
