import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles, COLORS } from '../styles/globalStyles'

export default function ConfirmationScreen({ route, navigation }) {
  const { barber, date, time, clientName, clientPhone } = route.params

  const handleGoHome = () => {
    // Navega al root del ClientStack (HomeScreen)
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <View style={styles.inner}>
        {/* Check circle */}
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>¡Cita confirmada!</Text>
        <Text style={styles.subtitle}>Tu cita ha sido agendada con éxito.</Text>

        {/* Details card */}
        <View style={styles.card}>
          <DetailRow label="Barbero" value={barber.name} />
          <DetailRow label="Fecha" value={date} />
          <DetailRow label="Hora" value={time} />
          <DetailRow label="Cliente" value={clientName} />
          <DetailRow label="Teléfono" value={clientPhone} />
        </View>

        <TouchableOpacity style={globalStyles.primaryBtn} onPress={handleGoHome}>
          <Text style={globalStyles.primaryBtnText}>VOLVER AL INICIO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function DetailRow({ label, value }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  )
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
})

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.available + '22',
    borderWidth: 2,
    borderColor: COLORS.available,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 32,
    color: COLORS.available,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
})
