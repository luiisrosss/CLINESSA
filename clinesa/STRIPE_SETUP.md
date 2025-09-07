
# Configuración de Stripe para CLINESA

## 🚀 Pasos para Configurar Stripe

### 1. Crear Cuenta en Stripe

1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. Completa la verificación de identidad
3. Activa tu cuenta para recibir pagos

### 2. Obtener Claves de API

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com)
2. En el menú lateral, selecciona **"Developers"** > **"API keys"**
3. Copia tu **Publishable key** (pk_test_... para testing, pk_live_... para producción)

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
```

### 4. Crear Productos y Precios en Stripe

#### Opción A: Usar Stripe Dashboard (Recomendado)

1. Ve a **"Products"** en el dashboard de Stripe
2. Crea 3 productos:

**Plan Básico:**
- Nombre: "Plan Básico"
- Descripción: "Perfecto para consultorios pequeños"
- Precio mensual: $29.99
- Precio anual: $299.99

**Plan Profesional:**
- Nombre: "Plan Profesional" 
- Descripción: "Ideal para clínicas medianas"
- Precio mensual: $79.99
- Precio anual: $799.99

**Plan Empresarial:**
- Nombre: "Plan Empresarial"
- Descripción: "Para hospitales y grandes organizaciones"
- Precio mensual: $199.99
- Precio anual: $1999.99

3. Copia los **Price IDs** de cada plan (price_...)

#### Opción B: Usar Stripe CLI

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Crear productos
stripe products create --name="Plan Básico" --description="Perfecto para consultorios pequeños"

# Crear precios (reemplaza prod_xxx con el ID del producto)
stripe prices create --product=prod_xxx --unit-amount=2999 --currency=usd --recurring[interval]=month
stripe prices create --product=prod_xxx --unit-amount=29999 --currency=usd --recurring[interval]=year
```

### 5. Actualizar Configuración de Stripe

Edita `src/lib/stripe.ts` y reemplaza los Price IDs:

```typescript
export const STRIPE_PLAN_IDS = {
  basic: {
    monthly: 'price_tu_id_mensual_basico', // Reemplaza con el ID real
    yearly: 'price_tu_id_anual_basico',    // Reemplaza con el ID real
  },
  professional: {
    monthly: 'price_tu_id_mensual_profesional',
    yearly: 'price_tu_id_anual_profesional',
  },
  enterprise: {
    monthly: 'price_tu_id_mensual_empresarial',
    yearly: 'price_tu_id_anual_empresarial',
  },
}
```

### 6. Configurar Webhooks (Opcional)

Para manejar eventos de Stripe en tiempo real:

1. Ve a **"Developers"** > **"Webhooks"**
2. Crea un nuevo endpoint: `https://tu-dominio.com/api/stripe-webhook`
3. Selecciona estos eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copia el **Webhook Secret** (whsec_...)

### 7. Configurar Supabase Edge Functions (Recomendado)

Para manejar la lógica de pagos de forma segura:

1. Instala Supabase CLI
2. Crea las funciones:

```bash
# Crear función para checkout
supabase functions new create-checkout-session

# Crear función para customer portal
supabase functions new create-customer-portal-session

# Crear función para webhooks
supabase functions new stripe-webhook
```

### 8. Testing

#### Tarjetas de Prueba de Stripe:

- **Éxito**: 4242 4242 4242 4242
- **Declinada**: 4000 0000 0000 0002
- **Requiere autenticación**: 4000 0025 0000 3155

#### Códigos de prueba:
- **CVC**: Cualquier código de 3 dígitos
- **Fecha**: Cualquier fecha futura
- **ZIP**: Cualquier código postal

### 9. Configuración de Producción

1. Cambia a **"Live mode"** en Stripe
2. Actualiza las variables de entorno con las claves de producción
3. Actualiza los Price IDs con los de producción
4. Configura webhooks con la URL de producción

## 🔧 Funcionalidades Implementadas

- ✅ **Selección de planes** con precios dinámicos
- ✅ **Checkout de Stripe** integrado
- ✅ **Customer Portal** para gestión de facturación
- ✅ **Soporte para facturación mensual y anual**
- ✅ **Validación de límites** de suscripción
- ✅ **Estados de suscripción** (trial, active, cancelled)
- ✅ **Interfaz responsive** y moderna

## 📱 Uso

1. Los usuarios pueden seleccionar un plan desde `/billing`
2. Se redirigen a Stripe Checkout para el pago
3. Después del pago, se crea la suscripción en la base de datos
4. Pueden gestionar su facturación desde el Customer Portal

## 🚨 Notas Importantes

- **Nunca** expongas las claves secretas en el frontend
- Usa **Supabase Edge Functions** para la lógica de pagos
- Configura **webhooks** para sincronizar estados
- Prueba exhaustivamente en **modo test** antes de producción
- Mantén **backups** de la configuración de Stripe

## 🆘 Solución de Problemas

### Error: "Stripe no está configurado"
- Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté configurado
- Asegúrate de que la clave comience con `pk_`

### Error: "Invalid price ID"
- Verifica que los Price IDs en `STRIPE_PLAN_IDS` sean correctos
- Asegúrate de que los precios estén activos en Stripe

### Error: "Checkout session creation failed"
- Verifica que las Edge Functions estén desplegadas
- Revisa los logs de Supabase Functions

## 📞 Soporte

- [Documentación de Stripe](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [CLINESA Issues](https://github.com/tu-repo/issues)
