module.exports = {
    mode: 'jit',
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: false,
    theme: {
        fontFamily: {
            sans: ['IBM Plex Sans', 'sans-serif'],
        },
        fontSize: {
            'body-1': ['16px', '20px'],
            'body-2': ['14px', '16px'],
            'body-3': ['12px', '16px'],
            'body-4': ['10px', '12px'],
        },
        fontWeight: {
            normal: 400,
            semibold: 600,
            bold: 700,
        },
        colors: {
            'brand-a1': '#FF9514',
            'brand-b1': '#1E4592',
            'shadow-a': 'rgba(12, 13, 13, 0.2)',
            'shadow-b': 'rgba(12, 13, 13, 0.1)',
            'black-a': '#0C0D0D',
            'black-c': '#7C7E83',
            'white-d': 'rgba(12, 13, 13, 0.2)',
        },
        spacing: {
            4: '4px',
            8: '8px',
            11: '11px',
            12: '12px',
            14: '14px',
            16: '16px',
            24: '24px',
            32: '32px',
            40: '40px',
            48: '48px',
            64: '64px',
            96: '96px',
        },
        borderRadius: {
            8: '8px',
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        outline: false,
    },
}
