module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AI NEWS - HUB Theme Colors (No Pink Tones)
        bg: {
          DEFAULT: '#0B0F14',
          soft: '#0F141B',
        },
        panel: {
          DEFAULT: '#121826',
          secondary: '#0E1624',
        },
        text: {
          DEFAULT: '#E6EDF7',
          muted: '#A9B4C4',
        },
        brand: {
          1: '#5CF2E3', // turkuaz
          2: '#7CC8FF', // buz mavi
        },
        accent: {
          1: '#C9FF5C', // lime vurgusu
          2: '#6DFFB3', // yeşil vurgusu
        },
        warning: '#FFCC66',
        danger: '#FF6B6B',
        success: '#52E2A7',
        // Legacy cosmic for backward compatibility (pink removed)
        cosmic: {
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
          950: '#082f49',
        },
        // Neon colors (pink removed for copyright safety)
        neon: {
          cyan: '#5CF2E3',
          green: '#6DFFB3',
          blue: '#7CC8FF',
          lime: '#C9FF5C',
          orange: '#FFCC66',
        }
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 8px 30px rgba(0,0,0,0.35)',
        'soft': '0 2px 10px rgba(0,0,0,0.25)',
        'brand': '0 0 0 2px rgba(124,200,255,0.45)',
        'glow': '0 0 20px rgba(92,242,227,0.3)',
      },
      backdropBlur: {
        'frost': '8px',
      },
      spacing: {
        'gutter': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-brand': 'pulseBrand 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'slide-up': 'slideUp 0.36s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        pulseBrand: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(124,200,255,0.2)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(124,200,255,0.4)',
            opacity: '0.8'
          }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(92,242,227,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(92,242,227,0.6)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'gradient-y': {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-100%)' }
        },
        'gradient-x': {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-100%)' }
        },
        'gradient-xy': {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '25%': { transform: 'translate(-100%, 0%)' },
          '50%': { transform: 'translate(-100%, -100%)' },
          '75%': { transform: 'translate(0%, -100%)' }
        }
      },
      backgroundImage: {
        // AI NEWS - HUB Gradients (Copyright-safe, original)
        'lens-hero': 'radial-gradient(1200px 800px at 20% 10%, #12243A 0%, #0B0F14 55%), conic-gradient(from 210deg at 70% 30%, #0B0F14 0%, #12243A 20%, #0B0F14 60%)',
        'lens-accent': 'linear-gradient(135deg, #5CF2E3 0%, #7CC8FF 50%, #C9FF5C 100%)',
        'lens-card': 'linear-gradient(180deg, rgba(124,200,255,0.08), rgba(92,242,227,0.06))',
        'lens-gradient': 'linear-gradient(90deg, #5CF2E3, #7CC8FF, #C9FF5C)',
        'lens-mesh': 'radial-gradient(at 40% 20%, rgba(92,242,227,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(124,200,255,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(201,255,92,0.2) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(109,255,179,0.3) 0px, transparent 50%)',
        // Legacy gradients (pink removed)
        'cosmic-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'neon-gradient': 'linear-gradient(90deg, #5CF2E3, #7CC8FF, #5CF2E3)',
      },
      fontFamily: {
        cosmic: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        lens: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
