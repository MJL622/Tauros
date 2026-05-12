import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS } from '../styles/globalStyles'

export default function TimeSlotButton({ slot, selected, onPress }) {
  const isAvailable = slot.is_available
  const isSelected = selected

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isAvailable}
      activeOpacity={0.75}
      style={[
        styles.button,
        isAvailable ? styles.available : styles.occupied,
        isSelected && styles.selected,
      ]}
    >
      <Text
        style={[
          styles.text,
          isAvailable ? styles.availableText : styles.occupiedText,
          isSelected && styles.selectedText,
        ]}
      >
        {slot.slot_time}
      </Text>
      {!isAvailable && (
        <Text style={styles.occupiedLabel}>Ocupado</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    margin: 4,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Disponible — verde
  available: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.available,
  },

  // Ocupado — rojo
  occupied: {
    backgroundColor: '#f4433611',
    borderColor: COLORS.cancelled,
  },

  // Seleccionado — dorado
  selected: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },

  text: {
    fontWeight: '700',
    fontSize: 14,
  },
  availableText: {
    color: COLORS.available,
  },
  occupiedText: {
    color: COLORS.cancelled,
  },
  selectedText: {
    color: COLORS.bg,
  },
  occupiedLabel: {
    fontSize: 9,
    color: COLORS.cancelled,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})
