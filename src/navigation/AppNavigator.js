import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Client screens
import HomeScreen from '../screens/HomeScreen'
import BarberDetailScreen from '../screens/BarberDetailScreen'
import TimeSlotScreen from '../screens/TimeSlotScreen'
import BookingScreen from '../screens/BookingScreen'
import ConfirmationScreen from '../screens/ConfirmationScreen'

// Admin screens
import AdminLoginScreen from '../screens/admin/AdminLoginScreen'
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen'
import AdminBarbersScreen from '../screens/admin/AdminBarbersScreen'
import AdminScheduleScreen from '../screens/admin/AdminScheduleScreen'
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen'

import { COLORS } from '../styles/globalStyles'

const Stack = createNativeStackNavigator()

const screenOpts = {
  headerStyle: { backgroundColor: COLORS.bg },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: { fontWeight: 'bold' },
}

// ─── Client Stack ─────────────────────────────────────────────────────────────
function ClientStack() {
  const ClientNav = createNativeStackNavigator()
  return (
    <ClientNav.Navigator screenOptions={screenOpts}>
      <ClientNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <ClientNav.Screen
        name="BarberDetail"
        component={BarberDetailScreen}
        options={({ route }) => ({ title: route.params?.barber?.name ?? 'Barbero' })}
      />
      <ClientNav.Screen
        name="TimeSlot"
        component={TimeSlotScreen}
        options={{ title: 'Seleccionar hora' }}
      />
      <ClientNav.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Confirmar cita' }}
      />
      <ClientNav.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ headerShown: false }}
      />
    </ClientNav.Navigator>
  )
}

// ─── Admin Stack (Stack simple, sin Drawer) ───────────────────────────────────
function AdminStack() {
  const AdminNav = createNativeStackNavigator()
  return (
    <AdminNav.Navigator screenOptions={screenOpts}>
      <AdminNav.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <AdminNav.Screen
        name="AdminBarbers"
        component={AdminBarbersScreen}
        options={{ title: 'Barberos' }}
      />
      <AdminNav.Screen
        name="AdminSchedule"
        component={AdminScheduleScreen}
        options={{ title: 'Horarios' }}
      />
      <AdminNav.Screen
        name="AdminBookings"
        component={AdminBookingsScreen}
        options={{ title: 'Citas' }}
      />
    </AdminNav.Navigator>
  )
}

// ─── Root Navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  const RootNav = createNativeStackNavigator()
  return (
    <RootNav.Navigator screenOptions={{ headerShown: false }}>
      <RootNav.Screen name="ClientStack" component={ClientStack} />
      <RootNav.Screen name="AdminLogin" component={AdminLoginScreen} />
      <RootNav.Screen name="AdminStack" component={AdminStack} />
    </RootNav.Navigator>
  )
}
