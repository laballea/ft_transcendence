module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'addFriend': '0px 0px 12px 8px #1E293B',
        'innerXL' : 'inset 0px 4px 24px 0px rgba(0,0,0,0.4)'
      },
      animation: {
        'vibrate' : 'vibrate 0.3s linear infinite both',
        'bgpanright' : 'bgpanright 8s infinite',
        'deglingo' : 'deglingo 1.5s both, fadein 1.5s ease both',
        'fadein' : 'fadein 1.5s ease both'
      },
      keyframes : {
        'vibrate' : {
          '0%' : { transform: 'translate(0)'},
          '20%' : { transform: 'translate(-1px, 1px)'},
          '40%' : { transform: 'translate(-1px, -1px)'},
          '60%' : { transform: 'translate(1px, 1px)'},
          '80%' : { transform: 'translate(1px, -1px)'},
          '100%' : { transform: 'translate(0)'}
        },
        'bgpanright' : {
          '0%, 100%' : { backgroundPosition: '0% 50%' },
          '50%' : { backgroundPosition: '100% 50%' },
        },
        'deglingo' : {
          '0%' : { transform: 'skew(0deg, 0deg)' } ,
          '30%' : { transform: 'skew(-25deg, -25deg)' } ,
          '40%' : { transform: 'skew(15deg, 15deg)' } ,
          '50%' : { transform: 'skew(-15deg, -15deg)' } ,
          '65%' : { transform: 'skew(5deg, 5deg)' } ,
          '75%' : { transform: 'skew(-5deg, -5deg)' } ,
          '100%' : { transform: 'skew(0deg, 0deg)' } 
        },
        'fadein' : {
          '0%' : { opacity : '0%'},
          '100%' : { opacity : '100%'},
        }
      }
      ,
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