import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { globalStyles, COLORS } from '../styles/globalStyles'
import { getBarberPhoto } from '../utils/barberPhotos'

// Month names in Spanish
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DAYS_SHORT = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function getDaysInMonth(year, month) {
  const days = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

function toDateStr(date) {
  return date.toISOString().split('T')[0]
}

export default function BarberDetailScreen({ route, navigation }) {
  const { barber } = route.params
  const localPhoto = getBarberPhoto(barber.name)
  const photoSource = localPhoto
    ? localPhoto
    : barber.photo_url
      ? { uri: barber.photo_url }
      : null

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  const days = getDaysInMonth(year, month)
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  const handleDayPress = (day) => {
    const isPast = day < today && toDateStr(day) !== toDateStr(today)
    if (isPast) return
    const dateStr = toDateStr(day)
    setSelectedDate(dateStr)
  }

  const handleContinue = () => {
    if (!selectedDate) return
    navigation.navigate('TimeSlot', { barber, date: selectedDate })
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Barber header */}
      <View style={styles.barberHeader}>
        {photoSource ? (
          <Image source={photoSource} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{barber.name?.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.barberName}>{barber.name}</Text>
        {barber.specialty ? (
          <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
        ) : null}
      </View>

      <Text style={styles.sectionLabel}>Selecciona una fecha</Text>

      {/* Calendar */}
      <View style={styles.calendar}>
        {/* Month navigation */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTHS[month]} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Text style={styles.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day labels */}
        <View style={styles.weekRow}>
          {DAYS_SHORT.map((d, i) => (
            <Text key={i} style={styles.weekLabel}>{d}</Text>
          ))}
        </View>

        {/* Days grid */}
        <View style={styles.daysGrid}>
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {days.map((day, i) => {
            const dateStr = toDateStr(day)
            const isPast = day < today && dateStr !== toDateStr(today)
            const isSelected = selectedDate === dateStr
            const isToday = dateStr === toDateStr(today)
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                  isPast && styles.pastCell,
                ]}
                onPress={() => handleDayPress(day)}
                disabled={isPast}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isPast && styles.pastDayText,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.available }]} />
            <Text style={styles.legendText}>Días con horario disponible</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[globalStyles.primaryBtn, !selectedDate && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={!selectedDate}
      >
        <Text style={globalStyles.primaryBtnText}>Ver horarios disponibles</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  barberHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  avatarFallback: {
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  barberName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  barberSpecialty: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  calendar: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    padding: 8,
  },
  navBtnText: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: '300',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCell: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 20,
  },
  selectedCell: {
    backgroundColor: COLORS.gold,
    borderRadius: 20,
  },
  pastCell: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  selectedDayText: {
    color: COLORS.bg,
    fontWeight: 'bold',
  },
  pastDayText: {
    color: COLORS.textMuted,
  },
  legend: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  btnDisabled: {
    backgroundColor: COLORS.goldDark,
    opacity: 0.5,
  },
})
