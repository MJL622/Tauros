import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBarbers } from '../hooks/useBarbers'
import BarberCard from '../components/BarberCard'
import { globalStyles, COLORS } from '../styles/globalStyles'

export default function HomeScreen({ navigation }) {
  const { barbers, loading, error, refetch } = useBarbers()

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.center}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>Cargando barberos...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.center}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={globalStyles.primaryBtn} onPress={refetch}>
            <Text style={globalStyles.primaryBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/logotauros.jpg.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.headerTitle}>TAUROS BARBERÍA</Text>
            <Text style={styles.headerSub}>Elige tu barbero</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.adminBtnText}>🔐</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={barbers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BarberCard
            barber={item}
            onPress={() => navigation.navigate('BarberDetail', { barber: item })}
          />
        )}
        ListEmptyComponent={
          <View style={[globalStyles.center, { marginTop: 60 }]}>
            <Text style={styles.emptyText}>No hay barberos disponibles.</Text>
            <TouchableOpacity style={[globalStyles.primaryBtn, { marginTop: 16 }]} onPress={refetch}>
              <Text style={globalStyles.primaryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  adminBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
  },
  adminBtnText: {
    fontSize: 18,
  },
  list: {
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.cancelled,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
})
