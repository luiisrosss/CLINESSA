import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    
    await expect(page.getByText('El email es requerido')).toBeVisible()
    await expect(page.getByText('La contraseña es requerida')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    
    await expect(page.getByText('El email no es válido')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    
    await expect(page.getByText('Credenciales inválidas')).toBeVisible()
  })

  test('should redirect to dashboard on successful login', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token?grant_type=password', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              first_name: 'Test',
              last_name: 'User',
              role: 'admin'
            }
          }
        })
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Contraseña').fill('password123')
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Bienvenido a CLINESA')).toBeVisible()
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page).toHaveURL('/login')
  })

  test('should show loading state during login', async ({ page }) => {
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Contraseña').fill('password123')
    
    const loginButton = page.getByRole('button', { name: 'Iniciar Sesión' })
    await loginButton.click()
    
    await expect(loginButton).toBeDisabled()
    await expect(page.getByTestId('loading-spinner')).toBeVisible()
  })
})
