import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native'
import { COLORS } from '../styles/globalStyles'
import { getBarberPhoto } from '../utils/barberPhotos'

export default function BarberCard({ barber, onPress }) {
  const localPhoto = getBarberPhoto(barber.name)
  const photoSource = localPhoto
    ? localPhoto
    : barber.photo_url
      ? { uri: barber.photo_url }
      : null

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {photoSource ? (
        <Image source={photoSource} style={styles.avatar} resizeMode="cover" />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarText}>
            {barber.name?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
      )}

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
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  avatarFallback: {
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  info: { flex: 1 },
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
