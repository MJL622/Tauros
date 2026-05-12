import { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native'
import { getAppointments, getAllBarbers, updateAppointmentStatus, deleteOldAppointments } from '../../services/supabaseService'
import { globalStyles, COLORS } from '../../styles/globalStyles'

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',  color: COLORS.pending },
  confirmed: { label: 'Confirmada', color: COLORS.confirmed },
  cancelled: { label: 'Cancelada',  color: COLORS.cancelled },
  completed: { label: 'Completada', color: COLORS.completed },
}

export default function AdminBookingsScreen() {
  const [appointments, setAppointments] = useState([])
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterBarber, setFilterBarber] = useState('all')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data } = await getAllBarbers()
    setBarbers(data || [])
    await fetchAppointments('all', '')
  }

  const fetchAppointments = useCallback(async (barberId = filterBarber, date = filterDate) => {
    const { data, error } = await getAppointments({
      date: date || undefined,
      barberId: barberId !== 'all' ? barberId : undefined,
    })
    if (error) Alert.alert('Error', error.message)
    else setAppointments(data || [])
    setLoading(false)
    setRefreshing(false)
  }, [filterBarber, filterDate])

  const applyFilters = () => fetchAppointments(filterBarber, filterDate)

  const clearFilters = () => {
    setFilterDate('')
    setFilterBarber('all')
    fetchAppointments('all', '')
  }

  const handleCleanOld = () => {
    Alert.alert(
      'Limpiar citas pasadas',
      '¿Eliminar todas las citas de fechas anteriores a hoy? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteOldAppointments()
            if (error) {
              Alert.alert('Error', error.message)
            } else {
              Alert.alert('Listo', 'Citas pasadas eliminadas correctamente.')
              fetchAppointments('all', '')
              setFilterDate('')
              setFilterBarber('all')
            }
          },
        },
      ]
    )
  }

  const handleStatusChange = (id, newStatus, label) => {
    Alert.alert(
      `Marcar como ${label}`,
      '¿Confirmas el cambio de estado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const { error } = await updateAppointmentStatus(id, newStatus)
            if (error) Alert.alert('Error', 'No se pudo actualizar el estado.')
            else fetchAppointments()
          },
        },
      ]
    )
  }

  const renderItem = ({ item }) => {
    const statusInfo = STATUS_CONFIG[item.status] ?? { label: item.status, color: '#888' }
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeText}>{item.appointment_time}</Text>
            <Text style={styles.dateText}>{item.appointment_date}</Text>
          </View>
          <View style={styles.clientBlock}>
            <Text style={styles.barberText}>{item.barbers?.name ?? '-'}</Text>
            <Text style={styles.clientText}>{item.client_name}</Text>
            {item.client_phone ? (
              <Text style={styles.phoneText}>📞 {item.client_phone}</Text>
            ) : null}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '22' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.confirmed + '22' }]}
              onPress={() => handleStatusChange(item.id, 'confirmed', 'Confirmada')}
            >
              <Text style={[styles.actionText, { color: COLORS.confirmed }]}>✓ Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.cancelled + '22' }]}
              onPress={() => handleStatusChange(item.id, 'cancelled', 'Cancelada')}
            >
              <Text style={[styles.actionText, { color: COLORS.cancelled }]}>✕ Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === 'confirmed' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: COLORS.gold + '22' }]}
              onPress={() => handleStatusChange(item.id, 'completed', 'Completada')}
            >
              <Text style={[styles.actionText, { color: COLORS.gold }]}>✓ Completar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    )
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Citas</Text>
        <TouchableOpacity onPress={() => fetchAppointments()} style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>⟳</Text>
        </TouchableOpacity>
      </View>

      {/* ── Filtros ── */}
      <View style={styles.filtersBox}>
        {/* Fecha */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>📅 Fecha</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#555"
            value={filterDate}
            onChangeText={setFilterDate}
          />
        </View>

        {/* Barbero — botones horizontales */}
        <Text style={styles.filterLabel}>✂️ Barbero</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.barberScroll}>
          <TouchableOpacity
            style={[styles.barberChip, filterBarber === 'all' && styles.barberChipActive]}
            onPress={() => setFilterBarber('all')}
          >
            <Text style={[styles.barberChipText, filterBarber === 'all' && styles.barberChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {barbers.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[styles.barberChip, filterBarber === b.id && styles.barberChipActive]}
              onPress={() => setFilterBarber(b.id)}
            >
              <Text style={[styles.barberChipText, filterBarber === b.id && styles.barberChipTextActive]}>
                {b.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botones aplicar / limpiar */}
        <View style={styles.filterActions}>
          <TouchableOpacity style={[globalStyles.primaryBtn, { flex: 1 }]} onPress={applyFilters}>
            <Text style={globalStyles.primaryBtnText}>Aplicar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.secondaryBtn, { flex: 1 }]} onPress={clearFilters}>
            <Text style={globalStyles.secondaryBtnText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
        {/* Botón limpiar citas pasadas */}
        <TouchableOpacity style={styles.cleanBtn} onPress={handleCleanOld}>
          <Text style={styles.cleanBtnText}>🗑 Eliminar citas pasadas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchAppointments() }}
            tintColor={COLORS.gold}
          />
        }
        ListEmptyComponent={
          <View style={[globalStyles.center, { marginTop: 40 }]}>
            <Text style={styles.emptyText}>No hay citas para los filtros seleccionados.</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  refreshBtn: { padding: 8 },
  refreshBtnText: { fontSize: 22, color: COLORS.gold },

  filtersBox: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  filterInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  barberScroll: { marginBottom: 8 },
  barberChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  barberChipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  barberChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  barberChipTextActive: {
    color: COLORS.bg,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cleanBtn: {
    backgroundColor: COLORS.cancelled + '18',
    borderWidth: 1,
    borderColor: COLORS.cancelled + '55',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  cleanBtnText: {
    color: COLORS.cancelled,
    fontSize: 13,
    fontWeight: '600',
  },

  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  timeBlock: { alignItems: 'center', minWidth: 52 },
  timeText: { fontSize: 15, fontWeight: '700', color: COLORS.gold },
  dateText: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  clientBlock: { flex: 1 },
  barberText: { fontSize: 12, color: COLORS.textSecondary },
  clientText: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  phoneText: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { flex: 1, padding: 9, borderRadius: 8, alignItems: 'center' },
  actionText: { fontSize: 13, fontWeight: '600' },
  emptyText: { color: COLORS.textMuted, fontSize: 15, textAlign: 'center' },
})
