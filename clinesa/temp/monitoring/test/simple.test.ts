import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should pass basic math', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle strings', () => {
    expect('hello').toBe('hello')
  })

  it('should handle arrays', () => {
    expect([1, 2, 3]).toHaveLength(3)
  })

  it('should handle objects', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj).toHaveProperty('name')
    expect(obj.name).toBe('test')
  })
})
