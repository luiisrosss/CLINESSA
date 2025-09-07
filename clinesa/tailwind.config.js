/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ultra minimalist palette - Black, White, and Warm Tertiaries
        primary: {
          0: '#ffffff',
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fafafa',
          300: '#f5f5f5',
          400: '#f0f0f0',
          500: '#e5e5e5',
          600: '#d4d4d4',
          700: '#a3a3a3',
          800: '#737373',
          900: '#404040',
          950: '#262626',
          1000: '#000000',
        },
        // Warm tertiary colors
        warm: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fbd9c1',
          300: '#f8c4a2',
          400: '#f5af83',
          500: '#f29a64',
          600: '#e88545',
          700: '#d17026',
          800: '#b85b07',
          900: '#9f4600',
        },
        // Soft terracotta
        terracotta: {
          50: '#fdf4f0',
          100: '#fbe9e0',
          200: '#f7d3c1',
          300: '#f3bda2',
          400: '#efa783',
          500: '#eb9164',
          600: '#d17b4a',
          700: '#b76530',
          800: '#9d4f16',
          900: '#833900',
        },
        // Warm beige
        beige: {
          50: '#fefcf9',
          100: '#fdf9f3',
          200: '#fbf3e7',
          300: '#f9eddb',
          400: '#f7e7cf',
          500: '#f5e1c3',
          600: '#e6c8a0',
          700: '#d7af7d',
          800: '#c8965a',
          900: '#b97d37',
        },
        // Keep medical colors for compatibility
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'minimal': '0 1px 1px 0 rgba(0, 0, 0, 0.02)',
        'minimal-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'minimal-md': '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'minimal-lg': '0 4px 8px 0 rgba(0, 0, 0, 0.05)',
        'minimal-xl': '0 8px 16px 0 rgba(0, 0, 0, 0.06)',
        'minimal-inner': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'warm': '0 1px 2px 0 rgba(242, 154, 100, 0.1)',
        'warm-sm': '0 2px 4px 0 rgba(242, 154, 100, 0.15)',
        'warm-md': '0 4px 8px 0 rgba(242, 154, 100, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionTimingFunction: {
        'attio': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'attio-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'attio-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

