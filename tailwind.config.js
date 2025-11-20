/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
'./app/**/*.{js,ts,jsx,tsx}',
'./pages/**/*.{js,ts,jsx,tsx}',
'./components/**/*.{js,ts,jsx,tsx}'
],
theme: {
extend: {
colors: {
brandGray: '#f3f4f6',
panelGray: '#e6e7e9',
deepGray: '#374151'
}
}
},
plugins: []
}
