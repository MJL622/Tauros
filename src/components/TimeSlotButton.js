import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS } from '../styles/globalStyles'

export default function TimeSlotButton({ slot, selected, onPress }) {
  const isAvailable = slot.is_available
  const isSelected = selected

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isAvailable}
      style={[
        styles.button,
        isSelected && styles.selected,
        !isAvailable && styles.occupied,
      ]}
      activeOpacity={0.75}
    >
      <Text
        style={[
          styles.text,
          isSelected && styles.selectedText,
          !isAvailable && styles.occupiedText,
        ]}
      >
        {slot.slot_time}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.available,
    margin: 4,
    minWidth: 72,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  occupied: {
    backgroundColor: '#2a2a2a',
    borderColor: COLORS.border,
  },
  text: {
    color: COLORS.available,
    fontWeight: '600',
    fontSize: 14,
  },
  selectedText: {
    color: COLORS.bg,
  },
  occupiedText: {
    color: COLORS.textMuted,
  },
})
