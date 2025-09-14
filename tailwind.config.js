/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#1F2937',
          card: '#1F2937',
          text: '#F9FAFB',
          textSecondary: '#9CA3AF',
          border: '#4B5563',
          input: '#374151',
        },
        light: {
          background: '#FFFFFF',
          card: '#FFFFFF',
          text: '#111827',
          textSecondary: '#4B5563',
          border: '#E5E7EB',
          input: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};
