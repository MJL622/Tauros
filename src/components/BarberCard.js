import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { COLORS } from '../styles/globalStyles'

export default function BarberCard({ barber, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {barber.name?.charAt(0).toUpperCase() ?? '?'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{barber.name}</Text>
        {barber.specialty ? (
          <Text style={styles.specialty}>Especialidad: {barber.specialty}</Text>
        ) : null}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  specialty: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: COLORS.textMuted,
  },
})
