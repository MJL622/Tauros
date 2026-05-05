import { StyleSheet } from 'react-native'

export const COLORS = {
  bg: '#1a1a1a',
  card: '#2a2a2a',
  border: '#3a3a3a',
  gold: '#c9a84c',
  goldDark: '#7a6530',
  white: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted: '#666666',
  available: '#4caf50',
  occupied: '#888888',
  pending: '#f0a500',
  confirmed: '#4caf50',
  cancelled: '#f44336',
  completed: '#888888',
}

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cccccc',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: COLORS.gold,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: COLORS.bg,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  secondaryBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
})
