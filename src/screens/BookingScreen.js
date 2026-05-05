import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useBooking } from '../hooks/useBooking'
import { globalStyles, COLORS } from '../styles/globalStyles'

export default function BookingScreen({ route, navigation }) {
  const { barber, date, time } = route.params
  const { book, loading } = useBooking()

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const validate = () => {
    let valid = true
    if (!clientName.trim()) { setNameError('Ingresa tu nombre completo.'); valid = false }
    else setNameError('')
    if (!clientPhone.trim()) { setPhoneError('Ingresa tu número de teléfono.'); valid = false }
    else setPhoneError('')
    return valid
  }

  const handleConfirm = async () => {
    if (!validate()) return

    const result = await book({
      barberId: barber.id,
      date,
      time,
      clientName,
      clientPhone,
    })

    if (result.success) {
      navigation.navigate('Confirmation', {
        barber,
        date,
        time,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
      })
    } else {
      Alert.alert('Error al confirmar', result.error ?? 'No se pudo crear la cita. Intenta de nuevo.')
    }
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Confirmar cita</Text>

        {/* Resumen */}
        <View style={styles.summaryCard}>
          <SummaryRow icon="✂️" label="Barbero" value={barber.name} />
          <SummaryRow icon="📅" label="Fecha" value={date} />
          <SummaryRow icon="🕐" label="Hora" value={time} />
        </View>

        <Text style={styles.sectionLabel}>Tus datos</Text>

        <Text style={globalStyles.label}>Nombre completo</Text>
        <TextInput
          style={[globalStyles.input, nameError ? styles.inputError : null]}
          placeholder="Nombre completo"
          placeholderTextColor="#555"
          value={clientName}
          onChangeText={(v) => { setClientName(v); setNameError('') }}
          autoCapitalize="words"
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={globalStyles.label}>Teléfono</Text>
        <TextInput
          style={[globalStyles.input, phoneError ? styles.inputError : null]}
          placeholder="Teléfono"
          placeholderTextColor="#555"
          value={clientPhone}
          onChangeText={(v) => { setClientPhone(v); setPhoneError('') }}
          keyboardType="phone-pad"
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <TouchableOpacity
          style={[globalStyles.primaryBtn, loading && styles.btnDisabled, { marginTop: 8 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={globalStyles.primaryBtnText}>
            {loading ? 'Confirmando...' : 'CONFIRMAR CITA'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function SummaryRow({ icon, label, value }) {
  return (
    <View style={summaryStyles.row}>
      <Text style={summaryStyles.icon}>{icon}</Text>
      <Text style={summaryStyles.label}>{label}:</Text>
      <Text style={summaryStyles.value}>{value}</Text>
    </View>
  )
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  icon: { fontSize: 16, width: 24 },
  label: { fontSize: 14, color: COLORS.textSecondary, width: 60 },
  value: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', flex: 1 },
})

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  inputError: {
    borderColor: COLORS.cancelled,
  },
  errorText: {
    color: COLORS.cancelled,
    fontSize: 12,
    marginBottom: 10,
    marginTop: -10,
  },
  btnDisabled: {
    backgroundColor: COLORS.goldDark,
    opacity: 0.6,
  },
})
