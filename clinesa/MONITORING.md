# 🔍 Sistema de Monitoreo y Logging - CLINESA

## 📋 Descripción General

CLINESA implementa un sistema completo de monitoreo que incluye:
- **Error Tracking** con Sentry
- **Analytics** con PostHog
- **Performance Monitoring** con Vercel Analytics
- **Logging Estructurado** personalizado

---

## 🛠️ Componentes del Sistema

### 1. **Sentry - Error Tracking**

#### Configuración:
```typescript
// src/lib/sentry.ts
import { initSentry } from './lib/sentry'

// Inicializar en main.tsx
initSentry()
```

#### Variables de Entorno:
```bash
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_SENTRY_ENVIRONMENT=development
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

#### Funcionalidades:
- ✅ **Error Tracking** automático
- ✅ **Performance Monitoring** con transacciones
- ✅ **Session Replay** para debugging
- ✅ **Source Maps** para stack traces claros
- ✅ **User Context** automático
- ✅ **Release Tracking** con commits

#### Uso:
```typescript
import { sentryUtils } from '@/lib/sentry'

// Capturar excepción manual
sentryUtils.captureException(error, { context: 'additional_data' })

// Capturar mensaje
sentryUtils.captureMessage('Something happened', 'warning')

// Agregar breadcrumb
sentryUtils.addBreadcrumb({
  message: 'User clicked button',
  category: 'user_action',
  level: 'info'
})
```

---

### 2. **PostHog - Analytics**

#### Configuración:
```typescript
// src/lib/analytics.ts
import { initAnalytics } from './lib/analytics'

// Inicializar en main.tsx
initAnalytics()
```

#### Variables de Entorno:
```bash
VITE_POSTHOG_KEY=your_posthog_key_here
VITE_POSTHOG_HOST=https://app.posthog.com
```

#### Funcionalidades:
- ✅ **Event Tracking** personalizado
- ✅ **User Identification** automática
- ✅ **Group Analytics** para organizaciones
- ✅ **Feature Flags** (preparado)
- ✅ **Funnel Analysis** para conversiones
- ✅ **Cohort Analysis** para retención

#### Eventos Predefinidos:
```typescript
import { analytics } from '@/lib/analytics'

// Autenticación
analytics.events.userLogin('email')
analytics.events.userLogout()
analytics.events.userRegister('google')

// Billing
analytics.events.planSelected('professional', 'monthly')
analytics.events.planUpgraded('basic', 'professional')
analytics.events.subscriptionCancelled('professional', 'too_expensive')

// Gestión de Pacientes
analytics.events.patientCreated('patient_123')
analytics.events.patientUpdated('patient_123')
analytics.events.patientDeleted('patient_123')

// Citas
analytics.events.appointmentCreated('appointment_456', 'consultation')
analytics.events.appointmentCancelled('appointment_456', 'patient_request')

// Límites de Plan
analytics.events.planLimitReached('users')
analytics.events.upgradePromptShown('basic', 'professional')
```

---

### 3. **Vercel Analytics - Performance**

#### Configuración:
```typescript
// main.tsx
import { Analytics } from '@vercel/analytics/react'

// En el JSX
<Analytics />
```

#### Funcionalidades:
- ✅ **Web Vitals** automáticos
- ✅ **Core Web Vitals** (LCP, FID, CLS)
- ✅ **Performance Metrics** detallados
- ✅ **Real User Monitoring** (RUM)

---

### 4. **Logging Estructurado**

#### Configuración:
```typescript
// src/lib/logger.ts
import { log } from '@/lib/logger'
```

#### Niveles de Log:
- **DEBUG** (0) - Información detallada para debugging
- **INFO** (1) - Información general del sistema
- **WARN** (2) - Advertencias que no detienen la ejecución
- **ERROR** (3) - Errores que requieren atención

#### Uso:
```typescript
// Logging básico
log.info('User logged in', { userId: '123', method: 'email' })
log.warn('API rate limit approaching', { endpoint: '/api/users' })
log.error('Database connection failed', error, { retryCount: 3 })

// Logging especializado
log.apiCall('/api/patients', 'GET', { userId: '123' })
log.apiSuccess('/api/patients', 'GET', 150, { userId: '123' })
log.apiError('/api/patients', 'GET', error, 500, { userId: '123' })

log.userAction('patient_created', { patientId: '456' })
log.businessEvent('subscription_upgraded', { from: 'basic', to: 'professional' })
log.performance('data_export', 2500, { recordCount: 1000 })
log.security('failed_login_attempt', { email: 'user@example.com' })
```

#### Contexto Estructurado:
```typescript
interface LogContext {
  userId?: string
  organizationId?: string
  sessionId?: string
  requestId?: string
  feature?: string
  action?: string
  [key: string]: any
}
```

---

## 🎯 Hook de Monitoreo

### `useMonitoring()`

Hook centralizado para tracking en componentes:

```typescript
import { useMonitoring } from '@/hooks/useMonitoring'

function MyComponent() {
  const { 
    trackPageView, 
    trackUserAction, 
    trackBusinessEvent,
    trackError,
    trackApiCall,
    trackPerformance,
    trackFeatureUsage,
    trackPlanLimit,
    trackUpgradePrompt,
    trackSearch,
    trackReportGeneration,
    trackSecurityEvent
  } = useMonitoring()

  // Track page views
  useEffect(() => {
    trackPageView('Patients Page', { organizationId: org.id })
  }, [])

  // Track user actions
  const handleCreatePatient = () => {
    trackUserAction('patient_create_clicked')
    // ... create patient logic
  }

  // Track API calls
  const fetchPatients = async () => {
    return trackApiCall(
      () => supabase.from('patients').select('*'),
      '/api/patients',
      'GET'
    )
  }

  // Track business events
  const handleUpgrade = () => {
    trackBusinessEvent('plan_upgrade_initiated', { 
      from: 'basic', 
      to: 'professional' 
    })
  }
}
```

---

## 📊 Dashboard de Monitoreo

### Log Viewer Component

Componente de debug para visualizar logs en tiempo real:

```typescript
import { LogViewer } from '@/components/debug/LogViewer'

function DebugPanel() {
  const [showLogs, setShowLogs] = useState(false)
  
  return (
    <>
      <Button onClick={() => setShowLogs(true)}>
        View Logs
      </Button>
      
      <LogViewer 
        isOpen={showLogs} 
        onClose={() => setShowLogs(false)} 
      />
    </>
  )
}
```

#### Funcionalidades del Log Viewer:
- ✅ **Filtrado por nivel** (Debug, Info, Warn, Error)
- ✅ **Búsqueda de texto** en mensajes y contexto
- ✅ **Exportación de logs** en formato JSON
- ✅ **Limpieza de logs** para liberar memoria
- ✅ **Auto-scroll** para logs en tiempo real
- ✅ **Contexto expandible** para debugging
- ✅ **Error details** con stack traces

---

## 🔧 Configuración de Producción

### Variables de Entorno Requeridas:

```bash
# Sentry
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
SENTRY_AUTH_TOKEN=your_auth_token

# PostHog
VITE_POSTHOG_KEY=phc_your_project_key
VITE_POSTHOG_HOST=https://app.posthog.com

# App
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=CLINESA
```

### Configuración de Vercel:

1. **Sentry Integration**:
   - Instalar Sentry Vercel integration
   - Configurar source maps automáticos
   - Configurar release tracking

2. **PostHog Integration**:
   - Configurar PostHog en Vercel
   - Habilitar session recording
   - Configurar feature flags

3. **Analytics**:
   - Vercel Analytics se activa automáticamente
   - Web Vitals se trackean automáticamente

---

## 📈 Métricas Clave

### Business Metrics:
- **User Registration** rate
- **Plan Conversion** rate
- **Feature Adoption** rate
- **User Retention** rate
- **Churn Rate** por plan

### Technical Metrics:
- **Error Rate** por endpoint
- **Response Time** por API
- **Page Load Time** por ruta
- **Core Web Vitals** scores
- **Memory Usage** trends

### User Behavior:
- **Feature Usage** patterns
- **Navigation** flows
- **Search** queries
- **Upgrade** prompts effectiveness
- **Support** ticket correlation

---

## 🚨 Alertas y Notificaciones

### Sentry Alerts:
- **Error Rate** > 5% en 5 minutos
- **New Issues** en producción
- **Performance** degradation > 50%
- **Memory Leaks** detection

### PostHog Alerts:
- **Conversion Rate** drops
- **Feature Usage** anomalies
- **User Churn** spikes
- **A/B Test** significance

---

## 🔍 Debugging y Troubleshooting

### 1. **Error Investigation**:
```typescript
// En Sentry dashboard
// 1. Ver error details con stack trace
// 2. Revisar user context y breadcrumbs
// 3. Analizar performance impact
// 4. Correlacionar con releases
```

### 2. **Performance Analysis**:
```typescript
// En Vercel Analytics
// 1. Revisar Core Web Vitals
// 2. Analizar page load times
// 3. Identificar slow API calls
// 4. Optimizar bundle size
```

### 3. **User Behavior Analysis**:
```typescript
// En PostHog dashboard
// 1. Analizar user journeys
// 2. Identificar drop-off points
// 3. Revisar feature adoption
// 4. Optimizar conversion funnels
```

---

## 📚 Mejores Prácticas

### 1. **Logging**:
- ✅ Usar niveles apropiados
- ✅ Incluir contexto relevante
- ✅ Evitar logs sensibles
- ✅ Usar structured logging

### 2. **Error Tracking**:
- ✅ Capturar errores con contexto
- ✅ Filtrar errores no críticos
- ✅ Incluir user context
- ✅ Agregar breadcrumbs útiles

### 3. **Analytics**:
- ✅ Trackear eventos de negocio
- ✅ Usar nombres consistentes
- ✅ Incluir propiedades relevantes
- ✅ Respetar privacidad del usuario

### 4. **Performance**:
- ✅ Medir operaciones críticas
- ✅ Monitorear Core Web Vitals
- ✅ Optimizar bundle size
- ✅ Usar lazy loading

---

## 🎯 Próximos Pasos

### Fase 1 - Implementación Básica ✅
- [x] Sentry error tracking
- [x] PostHog analytics
- [x] Vercel Analytics
- [x] Structured logging
- [x] Log viewer component

### Fase 2 - Monitoreo Avanzado 🔄
- [ ] Custom dashboards
- [ ] Automated alerts
- [ ] Performance budgets
- [ ] A/B testing framework

### Fase 3 - Inteligencia de Negocio 📊
- [ ] Predictive analytics
- [ ] User segmentation
- [ ] Churn prediction
- [ ] Revenue optimization

---

## 🆘 Soporte

Para problemas con el sistema de monitoreo:

1. **Revisar logs** en Log Viewer
2. **Verificar configuración** de variables de entorno
3. **Consultar dashboards** de Sentry/PostHog
4. **Revisar documentación** de cada servicio
5. **Contactar soporte** con logs relevantes

---

**¡El sistema de monitoreo está listo para producción! 🚀**
