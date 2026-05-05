# Tauros Barbería 💈
## AUTORES
SERGIO CAAMAÑO ARANGO
SANTIAGO ORDOÑEZ CARRILLO
MARIA JOSE ROJAS RUIZ

Aplicación móvil para gestión de citas de barbería, construida con **React Native + Expo** y **Supabase** como backend.

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuración inicial](#configuración-inicial)
- [Variables de entorno](#variables-de-entorno)
- [Instalación de dependencias](#instalación-de-dependencias)
- [Ejecutar la app](#ejecutar-la-app)
- [Configuración de Supabase](#configuración-de-supabase)
- [Flujos de la aplicación](#flujos-de-la-aplicación)
- [Pantallas](#pantallas)
- [Problemas conocidos y soluciones](#problemas-conocidos-y-soluciones)

---

## Descripción

Tauros Barbería permite a los clientes agendar citas con sus barberos favoritos sin necesidad de crear una cuenta. El módulo de administración (protegido por contraseña) permite gestionar barberos, horarios y citas.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework móvil |
| Expo | ~54.0.33 | Toolchain y build |
| Supabase JS | ^2.105.1 | Base de datos y auth |
| React Navigation Native Stack | ^7.14.12 | Navegación entre pantallas |
| AsyncStorage | 2.2.0 | Sesión admin local |
| React Native Safe Area Context | ~5.6.0 | Manejo de notch/status bar |
| React Native Screens | ~4.16.0 | Optimización de navegación |

---

## Estructura del proyecto

```
TaurosBarberia/
├── src/
│   ├── components/
│   │   ├── BarberCard.js          # Tarjeta de barbero en HomeScreen
│   │   └── TimeSlotButton.js      # Botón de horario (verde=libre, gris=ocupado)
│   ├── hooks/
│   │   ├── useBarbers.js          # Fetch de barberos activos desde Supabase
│   │   ├── useSlots.js            # Fetch de slots disponibles por barbero y fecha
│   │   └── useBooking.js          # Lógica para crear una cita
│   ├── navigation/
│   │   └── AppNavigator.js        # Navegador raíz + ClientStack + AdminStack
│   ├── screens/
│   │   ├── HomeScreen.js          # Lista de barberos disponibles
│   │   ├── BarberDetailScreen.js  # Calendario para seleccionar fecha
│   │   ├── TimeSlotScreen.js      # Grilla de horarios disponibles
│   │   ├── BookingScreen.js       # Formulario con datos del cliente
│   │   ├── ConfirmationScreen.js  # Resumen de cita confirmada
│   │   └── admin/
│   │       ├── AdminLoginScreen.js      # Login con contraseña simple
│   │       ├── AdminDashboardScreen.js  # Resumen: citas hoy, barberos activos
│   │       ├── AdminBarbersScreen.js    # CRUD de barberos + toggle activo/inactivo
│   │       ├── AdminScheduleScreen.js   # Horarios por día para cada barbero
│   │       └── AdminBookingsScreen.js   # Lista de citas con filtros y cambio de estado
│   ├── services/
│   │   └── supabaseService.js     # Todas las llamadas a Supabase centralizadas
│   └── styles/
│       └── globalStyles.js        # Colores, estilos y componentes reutilizables
├── App.js                         # Entry point con NavigationContainer
├── index.js                       # registerRootComponent de Expo
├── app.json                       # Configuración de Expo (newArchEnabled: false)
├── .env                           # Variables de entorno (no subir a git)
└── package.json
```

---

## Configuración inicial

### 1. Clonar o abrir el proyecto

```bash
cd TaurosBarberia
```

### 2. Instalar dependencias base

```bash
npm install
```

### 3. Instalar dependencias adicionales requeridas

```bash
npx expo install @react-navigation/native-stack @react-native-async-storage/async-storage @react-native-picker/picker react-native-safe-area-context react-native-screens
```

> **Nota:** No instalar `react-native-reanimated` ni `@react-navigation/drawer` — causan conflictos con la Nueva Arquitectura de React Native en Expo 54. La navegación admin usa un Stack Navigator simple en su lugar.

---

## Variables de entorno

Crear el archivo `.env` en la raíz del proyecto (`TaurosBarberia/.env`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
EXPO_PUBLIC_ADMIN_PASSWORD=tu-contraseña-admin
EXPO_PUBLIC_ADMIN_EMAIL=admin@tauros.com
```

> Las variables con prefijo `EXPO_PUBLIC_` son accesibles en el cliente mediante `process.env.EXPO_PUBLIC_*`.

---

## Ejecutar la app

```bash
npx expo start --clear
```

- Escanear el QR con **Expo Go** en el celular
- Presionar `a` para Android emulator
- Presionar `i` para iOS simulator

> Siempre usar `--clear` si se hicieron cambios en `.env` o `app.json`.

---

## Configuración de Supabase

### Tablas requeridas

| Tabla | Descripción |
|---|---|
| `barbers` | Barberos con `name`, `specialty`, `chair_number`, `is_active` |
| `schedules` | Horarios por barbero y día: `barber_id`, `day_of_week`, `start_time`, `end_time`, `slot_duration`, `is_active` |
| `appointments` | Citas: `barber_id`, `appointment_date`, `appointment_time`, `client_name`, `client_phone`, `status` |

### Función RPC requerida

La pantalla de slots llama a una función de Supabase:

```sql
get_available_slots(p_barber_id, p_date, p_duration_minutes)
```

Esta función debe retornar filas con `slot_time` (text) e `is_available` (boolean).

### Row Level Security (RLS)

Si RLS está activado en la tabla `appointments`, ejecutar en el **SQL Editor** de Supabase:

```sql
-- Clientes pueden crear citas sin autenticación
CREATE POLICY "Allow public insert"
ON appointments FOR INSERT TO anon
WITH CHECK (true);

-- Clientes y admin pueden leer citas
CREATE POLICY "Allow public select"
ON appointments FOR SELECT TO anon
USING (true);

-- Admin puede actualizar estado de citas
CREATE POLICY "Allow public update"
ON appointments FOR UPDATE TO anon
USING (true)
WITH CHECK (true);
```

> Sin estas políticas, al confirmar una cita aparece el error:
> `new row violates row-level security policy for table appointments`

---

## Flujos de la aplicación

### Módulo Cliente (sin autenticación)

```
HomeScreen
  → BarberDetailScreen   (seleccionar fecha en calendario)
    → TimeSlotScreen     (elegir horario disponible)
      → BookingScreen    (ingresar nombre y teléfono)
        → ConfirmationScreen  (resumen de cita confirmada)
```

### Módulo Admin (contraseña simple)

```
HomeScreen (botón 🔐)
  → AdminLoginScreen
    → AdminStack
        ├── AdminDashboardScreen  (resumen del día)
        ├── AdminBarbersScreen    (CRUD + toggle activo)
        ├── AdminScheduleScreen   (horarios por día)
        └── AdminBookingsScreen   (citas con filtros)
```

---

## Pantallas

### HomeScreen
- Lista todos los barberos activos (`is_active = true`)
- Botón 🔐 en esquina superior derecha para acceder al panel admin

### BarberDetailScreen
- Muestra calendario mensual del barbero seleccionado
- Solo permite seleccionar días presentes o futuros

### TimeSlotScreen
- Muestra grilla de horarios generados por la función RPC `get_available_slots`
- Verde con borde = disponible / Gris = ocupado

### BookingScreen
- Formulario con nombre completo y teléfono
- Valida campos vacíos antes de enviar
- Muestra Alert con error si Supabase rechaza el insert

### ConfirmationScreen
- Muestra resumen completo: barbero, fecha, hora, cliente, teléfono
- Botón "Volver al inicio" navega de regreso a HomeScreen

### AdminLoginScreen
- Contraseña simple comparada contra `EXPO_PUBLIC_ADMIN_PASSWORD`
- Guarda sesión en AsyncStorage al ingresar

### AdminDashboardScreen
- Estadísticas del día: citas totales, barberos activos, citas pendientes
- Lista las próximas 5 citas del día
- Acceso rápido a las demás secciones admin

### AdminBarbersScreen
- Lista todos los barberos con Switch para activar/desactivar
- El Switch hace update optimista (cambia al instante, revierte si hay error)
- Modal para crear o editar barbero (nombre, especialidad, número de silla)

### AdminScheduleScreen
- Selector de barbero mediante chips horizontales (sin Picker nativo)
- Toggle por día de la semana para activar/desactivar
- Campos de hora inicio, hora fin y duración de slot en minutos

### AdminBookingsScreen
- Filtros por fecha (texto) y por barbero (chips horizontales)
- Botones "Aplicar" y "Limpiar" para los filtros
- Acciones por cita según estado:
  - `pending` → Confirmar / Cancelar
  - `confirmed` → Completar

---

## Problemas conocidos y soluciones

### `react-native-reanimated` crash al iniciar
**Error:** `TurboModule method "installTurboModule" called with 1 arguments (expected 0)`  
**Causa:** Incompatibilidad con la Nueva Arquitectura (`newArchEnabled: true`)  
**Solución:** En `app.json` cambiar a `"newArchEnabled": false` y eliminar el plugin de reanimated.

### `react-native-gesture-handler` no encontrado
**Error:** `Unable to resolve module react-native-gesture-handler`  
**Causa:** Se importaba en `index.js` para el Drawer Navigator que fue eliminado  
**Solución:** Eliminar `import 'react-native-gesture-handler'` de `index.js`.

### Picker de barberos en blanco (Android)
**Causa:** `@react-native-picker/picker` no respeta el color de texto en fondos oscuros en Android  
**Solución:** Reemplazado por chips táctiles horizontales (`ScrollView` + `TouchableOpacity`).

### RLS error al confirmar cita
**Error:** `new row violates row-level security policy for table appointments`  
**Causa:** RLS activado sin políticas para el rol `anon`  
**Solución:** Crear políticas INSERT/SELECT/UPDATE para `anon` en Supabase (ver sección de configuración).

### Título pegado al status bar
**Causa:** Falta de `SafeAreaView` en pantallas con `headerShown: false`  
**Solución:** Envolver el contenido con `SafeAreaView` de `react-native-safe-area-context`.
