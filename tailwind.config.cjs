/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				darkGreen: '#4E773F',
  				lightGreen: '#91A659',
  				white: '#FFFFFF',
  				lightRed: '#dc3546'
  			},
  			secondary: {
  				blue: '#097BFD',
  				grey: '#666666',
  				black: '#000000',
  				subtleGrey: '#F3F2F2',
  				lightGrey: '#B3B3B3',
  				red: '#FF5757',
  				lightOrange: '#FFD493',
  				lightOrange2: '#FFBC57'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
