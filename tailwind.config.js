/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#933ea',
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-red-600',
    'bg-green-600',
    'bg-blue-600',
    'bg-yellow-600',
    'bg-red-300',
    'bg-green-300',
    'bg-blue-300',
    'bg-yellow-300',
    'hover:bg-red-600',
    'hover:bg-green-600',
    'hover:bg-blue-600',
    'hover:bg-yellow-600',
    'text-red-500',
    'text-green-500',
    'text-blue-500',
    'text-yellow-500',
    'border-red-300',
    'border-green-300',
    'border-blue-300',
    'border-yellow-300',
  ],
  plugins: [],
}
