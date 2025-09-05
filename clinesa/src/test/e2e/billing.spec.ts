import { test, expect } from '@playwright/test'

test.describe('Billing Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {
            first_name: 'Test',
            last_name: 'User',
            role: 'admin'
          }
        },
        organization: {
          id: 'test-org-id',
          name: 'Test Clinic'
        }
      }))
    })

    await page.goto('/billing')
  })

  test('should display billing page with subscription details', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Facturación' })).toBeVisible()
    await expect(page.getByText('Gestiona tu suscripción y métodos de pago')).toBeVisible()
  })

  test('should show plan limits display', async ({ page }) => {
    await expect(page.getByText('Uso Actual del Plan')).toBeVisible()
    await expect(page.getByText('Usuarios')).toBeVisible()
    await expect(page.getByText('Pacientes')).toBeVisible()
    await expect(page.getByText('Citas este mes')).toBeVisible()
  })

  test('should open plan selector when clicking "Ver Planes"', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Planes' }).click()
    
    await expect(page.getByText('Comparación de Planes')).toBeVisible()
    await expect(page.getByText('Plan Básico')).toBeVisible()
    await expect(page.getByText('Plan Profesional')).toBeVisible()
    await expect(page.getByText('Plan Empresarial')).toBeVisible()
  })

  test('should open plan selector when clicking "Cambiar Plan"', async ({ page }) => {
    await page.getByRole('button', { name: 'Cambiar Plan' }).click()
    
    await expect(page.getByText('Seleccionar Plan')).toBeVisible()
    await expect(page.getByText('Plan Básico')).toBeVisible()
    await expect(page.getByText('Plan Profesional')).toBeVisible()
    await expect(page.getByText('Plan Empresarial')).toBeVisible()
  })

  test('should show plan comparison table', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Planes' }).click()
    
    await expect(page.getByText('Comparación de Planes')).toBeVisible()
    
    // Check plan headers
    await expect(page.getByText('Básico')).toBeVisible()
    await expect(page.getByText('Profesional')).toBeVisible()
    await expect(page.getByText('Empresarial')).toBeVisible()
    
    // Check pricing
    await expect(page.getByText('$19.99/mes')).toBeVisible()
    await expect(page.getByText('$39.99/mes')).toBeVisible()
    await expect(page.getByText('$99.99/mes')).toBeVisible()
  })

  test('should show "MÁS POPULAR" badge on Professional plan', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Planes' }).click()
    
    await expect(page.getByText('MÁS POPULAR')).toBeVisible()
  })

  test('should show annual discount information', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Planes' }).click()
    
    await expect(page.getByText('Ahorra 17% con facturación anual')).toBeVisible()
  })

  test('should close plan selector when clicking close button', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Planes' }).click()
    await expect(page.getByText('Comparación de Planes')).toBeVisible()
    
    await page.getByRole('button', { name: 'Cerrar' }).click()
    
    await expect(page.getByText('Comparación de Planes')).not.toBeVisible()
  })

  test('should show upgrade recommendation when approaching limits', async ({ page }) => {
    // Mock approaching limit state
    await page.addInitScript(() => {
      window.localStorage.setItem('planLimits', JSON.stringify({
        usage: {
          currentUsers: 4,
          currentPatients: 950,
          currentAppointmentsThisMonth: 480,
          usagePercentage: {
            users: 80,
            patients: 95,
            appointments: 96
          }
        }
      }))
    })

    await page.reload()
    
    await expect(page.getByText('Recomendación de Actualización')).toBeVisible()
    await expect(page.getByText('Te estás acercando al límite')).toBeVisible()
  })

  test('should show trial warning when trial is expiring', async ({ page }) => {
    // Mock trial expiring state
    await page.addInitScript(() => {
      window.localStorage.setItem('subscription', JSON.stringify({
        isTrial: true,
        daysUntilTrialEnd: 2
      }))
    })

    await page.reload()
    
    await expect(page.getByText('Período de Prueba Próximo a Vencer')).toBeVisible()
    await expect(page.getByText('Tu período de prueba termina en 2 días')).toBeVisible()
  })

  test('should show no subscription message when no subscription', async ({ page }) => {
    // Mock no subscription state
    await page.addInitScript(() => {
      window.localStorage.removeItem('subscription')
    })

    await page.reload()
    
    await expect(page.getByText('No hay suscripción activa')).toBeVisible()
    await expect(page.getByText('Selecciona un plan para comenzar a usar CLINESA')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.getByRole('heading', { name: 'Facturación' })).toBeVisible()
    await expect(page.getByText('Uso Actual del Plan')).toBeVisible()
    
    // Check that plan selector is accessible on mobile
    await page.getByRole('button', { name: 'Ver Planes' }).click()
    await expect(page.getByText('Comparación de Planes')).toBeVisible()
  })
})
