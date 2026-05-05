import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { getAllBarbers, createBarber, updateBarber } from '../../services/supabaseService'
import { globalStyles, COLORS } from '../../styles/globalStyles'

export default function AdminBarbersScreen() {
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBarber, setEditingBarber] = useState(null)
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [chairNumber, setChairNumber] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchBarbers() }, [])

  const fetchBarbers = async () => {
    setLoading(true)
    const { data, error } = await getAllBarbers()
    if (error) Alert.alert('Error', error.message)
    setBarbers(data || [])
    setLoading(false)
  }

  const openCreate = () => {
    setEditingBarber(null)
    setName('')
    setSpecialty('')
    setChairNumber('')
    setModalVisible(true)
  }

  const openEdit = (barber) => {
    setEditingBarber(barber)
    setName(barber.name)
    setSpecialty(barber.specialty ?? '')
    setChairNumber(barber.chair_number?.toString() ?? '')
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'El nombre es obligatorio.')
      return
    }
    setSaving(true)
    const payload = {
      name: name.trim(),
      specialty: specialty.trim() || null,
      chair_number: chairNumber ? parseInt(chairNumber, 10) : null,
      is_active: editingBarber ? editingBarber.is_active : true,
    }
    const { error } = editingBarber
      ? await updateBarber(editingBarber.id, payload)
      : await createBarber(payload)
    setSaving(false)
    if (error) {
      Alert.alert('Error al guardar', error.message)
    } else {
      setModalVisible(false)
      fetchBarbers()
    }
  }

  const toggleActive = async (barber) => {
    // Optimistic update
    setBarbers(prev =>
      prev.map(b => b.id === barber.id ? { ...b, is_active: !b.is_active } : b)
    )
    const { error } = await updateBarber(barber.id, { is_active: !barber.is_active })
    if (error) {
      // Revert on error
      Alert.alert('Error', 'No se pudo actualizar el estado: ' + error.message)
      setBarbers(prev =>
        prev.map(b => b.id === barber.id ? { ...b, is_active: barber.is_active } : b)
      )
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardLeft} onPress={() => openEdit(item)} activeOpacity={0.7}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.barberName}>{item.name}</Text>
          <Text style={styles.barberSub}>
            {item.specialty ?? 'Sin especialidad'}
            {item.chair_number ? `  ·  Silla: ${item.chair_number}` : ''}
          </Text>
        </View>
      </TouchableOpacity>
      <Switch
        value={!!item.is_active}
        onValueChange={() => toggleActive(item)}
        trackColor={{ false: '#444', true: COLORS.gold + '88' }}
        thumbColor={item.is_active ? COLORS.gold : '#888'}
      />
    </View>
  )

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
        <Text style={styles.screenTitle}>Barberos</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay barberos registrados.</Text>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingBarber ? 'Editar barbero' : 'Nuevo barbero'}
            </Text>

            <Text style={globalStyles.label}>Nombre *</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={globalStyles.label}>Especialidad</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: Cortes clásicos"
              placeholderTextColor="#555"
              value={specialty}
              onChangeText={setSpecialty}
            />

            <Text style={globalStyles.label}>Número de silla</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ej: 1"
              placeholderTextColor="#555"
              value={chairNumber}
              onChangeText={setChairNumber}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={[globalStyles.primaryBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={globalStyles.primaryBtnText}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.secondaryBtn, { marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={globalStyles.secondaryBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  addBtn: {
    backgroundColor: COLORS.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 20,
    color: COLORS.bg,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  info: { flex: 1 },
  barberName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  barberSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
})
