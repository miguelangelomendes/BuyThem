/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
function withOpacity(themeVariable) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${themeVariable}), ${opacityValue})`
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${themeVariable}), var(${opacityVariable}, 1))`
    }
    return `rgb(var(${themeVariable}))`
  }
}

module.exports = {
  content: ['./src/**/*.html' /* ... */],
  theme: {
    fontSize: {
      'xxs': '0.60rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    fontFamily: {
      'rubik': ['Rubik'],
      'sans': ['Rubik', '-apple-system', 'BlinkMacSystemFont'],
    },
    extend: {
      screens: {
        '3xl': '1900px',
      },
      colors: {
        primary: withOpacity('--color-primary'),
        'primary-hover': withOpacity('--color-primary-hover'),
        'on-primary': withOpacity('--color-on-primary'),
        'on-primary-hover': withOpacity('--color-on-primary-hover'),

        accent: withOpacity('--color-accent'),
        'accent-hover': withOpacity('--color-accent-hover'),

        success: withOpacity('--color-success'),
        warning: withOpacity('--color-warning'),
        danger: withOpacity('--color-danger'),
        'danger-hover': withOpacity('--color-danger-hover'),

        'surface': withOpacity('--color-surface'),
        'surface-secondary': withOpacity('--color-surface-secondary'),
        'on-surface': withOpacity('--color-on-surface'),

        background: withOpacity('--color-background'),
        'background-secondary': withOpacity('--color-background-secondary'),

        paragraph: withOpacity('--color-paragraph'),
        'paragraph-variant': withOpacity('--color-paragraph-variant'),
      },
      transitionDuration: {
        '0': '0ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      boxShadow: {
        'sm-diffused': '0 1px 2px 0px rgba(0, 0, 0, 0.03), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'md-diffused': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'lg-diffused': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'xl-diffused': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
}
