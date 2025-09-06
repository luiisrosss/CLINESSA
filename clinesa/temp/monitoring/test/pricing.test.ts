import { describe, it, expect } from 'vitest'

// Mock pricing data
const mockPricing = {
  basic: {
    monthly: 19.99,
    yearly: 199.99,
    name: 'Básico',
    type: 'basic',
    maxUsers: 1,
    maxPatients: 200,
    maxAppointmentsPerMonth: 100,
  },
  professional: {
    monthly: 39.99,
    yearly: 399.99,
    name: 'Profesional',
    type: 'professional',
    maxUsers: 5,
    maxPatients: 1000,
    maxAppointmentsPerMonth: 500,
  },
  enterprise: {
    monthly: 99.99,
    yearly: 999.99,
    name: 'Empresarial',
    type: 'enterprise',
    maxUsers: 50,
    maxPatients: 5000,
    maxAppointmentsPerMonth: 2000,
  },
}

describe('Pricing Strategy', () => {
  describe('Annual Discounts', () => {
    it('should calculate annual discount correctly', () => {
      const basic = mockPricing.basic
      const professional = mockPricing.professional
      const enterprise = mockPricing.enterprise

      const basicDiscount = ((basic.monthly * 12 - basic.yearly) / (basic.monthly * 12)) * 100
      const professionalDiscount = ((professional.monthly * 12 - professional.yearly) / (professional.monthly * 12)) * 100
      const enterpriseDiscount = ((enterprise.monthly * 12 - enterprise.yearly) / (enterprise.monthly * 12)) * 100

      expect(basicDiscount).toBeCloseTo(17, 0) // 17% discount
      expect(professionalDiscount).toBeCloseTo(17, 0) // 17% discount
      expect(enterpriseDiscount).toBeCloseTo(17, 0) // 17% discount
    })

    it('should show correct savings amount', () => {
      const basic = mockPricing.basic
      const professional = mockPricing.professional
      const enterprise = mockPricing.enterprise

      const basicSavings = (basic.monthly * 12) - basic.yearly
      const professionalSavings = (professional.monthly * 12) - professional.yearly
      const enterpriseSavings = (enterprise.monthly * 12) - enterprise.yearly

      expect(basicSavings).toBeCloseTo(39.89, 2) // $239.88 - $199.99 = $39.89
      expect(professionalSavings).toBeCloseTo(79.89, 2) // $479.88 - $399.99 = $79.89
      expect(enterpriseSavings).toBeCloseTo(199.89, 2) // $1199.88 - $999.99 = $199.89
    })
  })

  describe('Value Propositions', () => {
    it('should calculate cost per user correctly', () => {
      const basic = mockPricing.basic
      const professional = mockPricing.professional
      const enterprise = mockPricing.enterprise

      const basicCostPerUser = basic.monthly / basic.maxUsers
      const professionalCostPerUser = professional.monthly / professional.maxUsers
      const enterpriseCostPerUser = enterprise.monthly / enterprise.maxUsers

      expect(basicCostPerUser).toBeCloseTo(19.99, 2) // $19.99 / 1 user
      expect(professionalCostPerUser).toBeCloseTo(7.998, 2) // $39.99 / 5 users = $7.998
      expect(enterpriseCostPerUser).toBeCloseTo(1.9998, 2) // $99.99 / 50 users = $1.9998
    })

    it('should calculate cost per patient correctly', () => {
      const basic = mockPricing.basic
      const professional = mockPricing.professional
      const enterprise = mockPricing.enterprise

      const basicCostPerPatient = basic.monthly / basic.maxPatients
      const professionalCostPerPatient = professional.monthly / professional.maxPatients
      const enterpriseCostPerPatient = enterprise.monthly / enterprise.maxPatients

      expect(basicCostPerPatient).toBeCloseTo(0.10, 2) // $19.99 / 200 patients = $0.10
      expect(professionalCostPerPatient).toBeCloseTo(0.04, 2) // $39.99 / 1000 patients = $0.04
      expect(enterpriseCostPerPatient).toBeCloseTo(0.02, 2) // $99.99 / 5000 patients = $0.02
    })

    it('should calculate cost per appointment correctly', () => {
      const basic = mockPricing.basic
      const professional = mockPricing.professional
      const enterprise = mockPricing.enterprise

      const basicCostPerAppointment = basic.monthly / basic.maxAppointmentsPerMonth
      const professionalCostPerAppointment = professional.monthly / professional.maxAppointmentsPerMonth
      const enterpriseCostPerAppointment = enterprise.monthly / enterprise.maxAppointmentsPerMonth

      expect(basicCostPerAppointment).toBeCloseTo(0.20, 2) // $19.99 / 100 appointments = $0.20
      expect(professionalCostPerAppointment).toBeCloseTo(0.08, 2) // $39.99 / 500 appointments = $0.08
      expect(enterpriseCostPerAppointment).toBeCloseTo(0.05, 2) // $99.99 / 2000 appointments = $0.05
    })
  })

  describe('Psychology Pricing', () => {
    it('should have professional plan as best value', () => {
      const professional = mockPricing.professional
      const basic = mockPricing.basic
      const enterprise = mockPricing.enterprise

      // Professional offers 5x more users for 2x the price
      const userValueRatio = (professional.maxUsers / basic.maxUsers) / (professional.monthly / basic.monthly)
      expect(userValueRatio).toBeCloseTo(2.5, 1) // 5x users / 2x price = 2.5x value

      // Professional offers 5x more patients for 2x the price
      const patientValueRatio = (professional.maxPatients / basic.maxPatients) / (professional.monthly / basic.monthly)
      expect(patientValueRatio).toBeCloseTo(2.5, 1) // 5x patients / 2x price = 2.5x value
    })

    it('should have enterprise plan as premium option', () => {
      const enterprise = mockPricing.enterprise
      const professional = mockPricing.professional

      // Enterprise is 2.5x the price of professional
      const priceRatio = enterprise.monthly / professional.monthly
      expect(priceRatio).toBeCloseTo(2.5, 1)

      // But offers 10x more users
      const userRatio = enterprise.maxUsers / professional.maxUsers
      expect(userRatio).toBe(10)

      // And 5x more patients
      const patientRatio = enterprise.maxPatients / professional.maxPatients
      expect(patientRatio).toBe(5)
    })

    it('should have basic plan as entry point', () => {
      const basic = mockPricing.basic
      const professional = mockPricing.professional

      // Basic is half the price of professional
      const priceRatio = basic.monthly / professional.monthly
      expect(priceRatio).toBeCloseTo(0.5, 1)

      // But offers 1/5 the users
      const userRatio = basic.maxUsers / professional.maxUsers
      expect(userRatio).toBe(0.2)

      // And 1/5 the patients
      const patientRatio = basic.maxPatients / professional.maxPatients
      expect(patientRatio).toBe(0.2)
    })
  })

  describe('ROI Calculations', () => {
    it('should calculate time savings value', () => {
      // Assuming 2 hours saved per day for basic plan
      const basicTimeSavings = 2 * 30 * 20 // 2 hours/day * 30 days * $20/hour
      const basicMonthlyValue = basicTimeSavings
      const basicROI = (basicMonthlyValue - mockPricing.basic.monthly) / mockPricing.basic.monthly

      expect(basicROI).toBeGreaterThan(50) // High ROI

      // Assuming 4 hours saved per day for professional plan
      const professionalTimeSavings = 4 * 30 * 20 // 4 hours/day * 30 days * $20/hour
      const professionalMonthlyValue = professionalTimeSavings
      const professionalROI = (professionalMonthlyValue - mockPricing.professional.monthly) / mockPricing.professional.monthly

      expect(professionalROI).toBeGreaterThan(10) // High ROI
    })

    it('should calculate revenue increase value', () => {
      // Assuming 20% revenue increase for professional plan
      const baseRevenue = 10000 // $10,000 base monthly revenue
      const professionalRevenueIncrease = baseRevenue * 0.20 // $2,000 increase
      const professionalROI = professionalRevenueIncrease / mockPricing.professional.monthly

      expect(professionalROI).toBeCloseTo(50, 0) // 5000% ROI
    })
  })

  describe('Plan Comparison', () => {
    it('should show clear progression between plans', () => {
      const plans = [mockPricing.basic, mockPricing.professional, mockPricing.enterprise]
      
      // Each plan should be more expensive than the previous
      expect(plans[1].monthly).toBeGreaterThan(plans[0].monthly)
      expect(plans[2].monthly).toBeGreaterThan(plans[1].monthly)

      // Each plan should offer more capacity than the previous
      expect(plans[1].maxUsers).toBeGreaterThan(plans[0].maxUsers)
      expect(plans[2].maxUsers).toBeGreaterThan(plans[1].maxUsers)

      expect(plans[1].maxPatients).toBeGreaterThan(plans[0].maxPatients)
      expect(plans[2].maxPatients).toBeGreaterThan(plans[1].maxPatients)
    })

    it('should have professional as most popular choice', () => {
      const professional = mockPricing.professional
      const basic = mockPricing.basic

      // Professional offers good value per dollar compared to basic
      const basicValuePerDollar = basic.maxPatients / basic.monthly
      const professionalValuePerDollar = professional.maxPatients / professional.monthly

      // Professional should be better than basic
      expect(professionalValuePerDollar).toBeGreaterThan(basicValuePerDollar)
      
      // Professional should be the sweet spot (not too cheap, not too expensive)
      expect(professional.monthly).toBeGreaterThan(basic.monthly)
      expect(professional.monthly).toBeLessThan(100) // Less than $100
    })
  })
})
