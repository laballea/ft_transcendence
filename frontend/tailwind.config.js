module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'addFriend': '0px 0px 12px 8px #1E293B',
      },
      animation: {
        'vibrate' : 'vibrate 0.3s linear infinite both',
      },
      keyframes : {
        'vibrate' : {
          '0%' : { transform: 'translate(0)'},
          '20%' : { transform: 'translate(-1px, 1px)'},
          '40%' : { transform: 'translate(-1px, -1px)'},
          '60%' : { transform: 'translate(1px, 1px)'},
          '80%' : { transform: 'translate(1px, -1px)'},
          '100%' : { transform: 'translate(0)'}
        }
      },
      dropShadow: {
        'custom1': '0px -8px 10px rgba(0, 0, 0, 0.15)',
        'custom2': '0px 8px 10px rgba(0, 0, 0, 0.15)',
      }

    },
    fontFamily: {
      'pilowlava': ['Pilowlava-Regular', 'sans-serif'],
      'space' : ['Space Mono', 'monospace']
    }
  },
  plugins: [],
}