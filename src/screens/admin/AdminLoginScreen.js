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
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verifyAdmin } from '../../services/supabaseService'
import { globalStyles, COLORS } from '../../styles/globalStyles'

const ADMIN_SESSION_KEY = 'admin_session'

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa tu correo y contraseña.')
      return
    }
    setLoading(true)

    const { data, error } = await verifyAdmin(email, password)

    if (error) {
      console.log('verifyAdmin error:', JSON.stringify(error))
    }
    console.log('verifyAdmin data:', JSON.stringify(data))

    setLoading(false)

    // data es un array — la función RPC retorna filas
    if (error || !data || data.length === 0) {
      Alert.alert('Acceso denegado', 'Correo o contraseña incorrectos.')
      return
    }

    const admin = data[0]
    await AsyncStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ id: admin.id, name: admin.name, email: admin.email }))
    navigation.replace('AdminStack')
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Image
            source={require('../../../assets/logotauros.jpg.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>TAUROS BARBERÍA</Text>
          <Text style={styles.title}>Acceso Administrador</Text>

          <Text style={globalStyles.label}>Correo</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="admin@tauros.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

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
  logo: {
    width: 90,
    height: 90,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
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
