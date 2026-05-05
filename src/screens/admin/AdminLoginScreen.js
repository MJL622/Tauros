import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { globalStyles, COLORS } from '../../styles/globalStyles'

const ADMIN_PASSWORD_KEY = 'admin_session'

export default function AdminLoginScreen({ navigation }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Campo requerido', 'Ingresa la contraseña.')
      return
    }
    setLoading(true)
    const adminPassword = process.env.EXPO_PUBLIC_ADMIN_PASSWORD
    if (password !== adminPassword) {
      setLoading(false)
      Alert.alert('Acceso denegado', 'Contraseña incorrecta.')
      return
    }
    await AsyncStorage.setItem(ADMIN_PASSWORD_KEY, 'true')
    setLoading(false)
    navigation.replace('AdminStack')
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.brandTitle}>TAUROS BARBERÍA</Text>
          <Text style={styles.title}>Acceso Administrador</Text>

          <Text style={globalStyles.label}>Contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[globalStyles.input, styles.passwordInput]}
              placeholder="••••••••"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[globalStyles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.bg} />
            ) : (
              <Text style={globalStyles.primaryBtnText}>INGRESAR</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gold,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 28,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  eyeIcon: { fontSize: 18 },
  btnDisabled: {
    backgroundColor: COLORS.goldDark,
    opacity: 0.6,
  },
  backBtn: {
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  backBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
})
