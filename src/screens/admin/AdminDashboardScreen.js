import { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAppointments, getAllBarbers } from '../../services/supabaseService'
import { globalStyles, COLORS } from '../../styles/globalStyles'

export default function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    todayCount: 0,
    activeBarbers: 0,
    pendingCount: 0,
    availableChairs: 0,
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]

    const [appointmentsRes, barbersRes] = await Promise.all([
      getAppointments({ date: today }),
      getAllBarbers(),
    ])

    const appointments = appointmentsRes.data || []
    const barbers = barbersRes.data || []

    setStats({
      todayCount: appointments.length,
      activeBarbers: barbers.filter((b) => b.is_active).length,
      pendingCount: appointments.filter((a) => a.status === 'pending').length,
      availableChairs: barbers.filter((b) => b.is_active).length,
    })

    setUpcomingAppointments(appointments.slice(0, 5))
    setLoading(false)
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('admin_session')
    navigation.replace('AdminLogin')
  }

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    )
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Image
            source={require('../../../assets/logotauros.jpg.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.screenTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Citas hoy" value={stats.todayCount} />
        <StatCard label="Barberos activos" value={stats.activeBarbers} />
        <StatCard label="Citas pendientes" value={stats.pendingCount} />
        <StatCard label="Sillas disponibles" value={stats.availableChairs} />
      </View>

      {/* Upcoming appointments */}
      <Text style={styles.sectionTitle}>Citas próximas</Text>
      {upcomingAppointments.length === 0 ? (
        <Text style={styles.emptyText}>No hay citas para hoy.</Text>
      ) : (
        upcomingAppointments.map((appt) => (
          <View key={appt.id} style={styles.apptRow}>
            <Text style={styles.apptTime}>{appt.appointment_time}</Text>
            <Text style={styles.apptBarber}>{appt.barbers?.name ?? '-'}</Text>
            <Text style={styles.apptClient}>{appt.client_name}</Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={[globalStyles.primaryBtn, styles.allCitasBtn]}
        onPress={() => navigation.navigate('AdminBookings')}
      >
        <Text style={globalStyles.primaryBtnText}>VER TODAS LAS CITAS</Text>
      </TouchableOpacity>

      {/* Quick nav */}
      <View style={styles.quickNav}>
        <QuickNavBtn label="Barberos" onPress={() => navigation.navigate('AdminBarbers')} />
        <QuickNavBtn label="Horarios" onPress={() => navigation.navigate('AdminSchedule')} />
        <QuickNavBtn label="Citas" onPress={() => navigation.navigate('AdminBookings')} />
      </View>
    </ScrollView>
  )
}

function StatCard({ label, value }) {
  return (
    <View style={statStyles.card}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  )
}

function QuickNavBtn({ label, onPress }) {
  return (
    <TouchableOpacity style={quickStyles.btn} onPress={onPress}>
      <Text style={quickStyles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

const statStyles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
})

const quickStyles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
})

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  logoutBtn: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  logoutText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
  apptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  apptTime: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gold,
    width: 48,
  },
  apptBarber: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  apptClient: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  allCitasBtn: {
    marginTop: 20,
    marginBottom: 20,
  },
  quickNav: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    paddingVertical: 12,
  },
})
