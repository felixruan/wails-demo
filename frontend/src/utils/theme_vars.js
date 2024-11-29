export function useThemeVars(isDark) {
    const themeVars = {
        fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fontFamilyMono: 'v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
        fontWeight: '400',
        fontWeightStrong: '500',
        cubicBezierEaseInOut: 'cubic-bezier(.4, 0, .2, 1)',
        cubicBezierEaseOut: 'cubic-bezier(0, 0, .2, 1)',
        cubicBezierEaseIn: 'cubic-bezier(.4, 0, 1, 1)',
        borderRadius: '3px',
        borderRadiusSmall: '2px',
        fontSize: '14px',
        fontSizeMini: '12px',
        fontSizeTiny: '12px',
        fontSizeSmall: '14px',
        fontSizeMedium: '14px',
        fontSizeLarge: '15px',
        fontSizeHuge: '16px',
        lineHeight: '1.6',
        heightMini: '16px',
        // private now, it's too small
        heightTiny: '22px',
        heightSmall: '28px',
        heightMedium: '34px',
        heightLarge: '40px',
        heightHuge: '46px'
    }
    if (isDark) {
        return {
            ...themeVars,
            // primary color
            primaryColor: '#63e2b7',
            primaryColorHover: '#7fe7c4',
            primaryColorPressed: '#5acea7',
            primaryColorSuppl: 'rgb(42, 148, 125)',
            // text color
            textColorBase: '#fff',
            textColor1: 'rgba(255, 255, 255, 0.9)',
            textColor2: 'rgba(255, 255, 255, 0.82)',
            textColor3: 'rgba(255, 255, 255, 0.52)',
            // other
            bodyColor: 'rgb(16, 16, 20)',
            borderColor: 'rgba(255, 255, 255, 0.24)',
        }
    }
    return {
        ...themeVars,
        // primary color
        primaryColor: '#18a058',
        primaryColorHover: '#36ad6a',
        primaryColorPressed: '#0c7a43',
        primaryColorSuppl: '#36ad6a',
        // text color
        textColorBase: '#000',
        textColor1: 'rgb(31, 34, 37)',
        textColor2: 'rgb(51, 54, 57)',
        textColor3: 'rgb(118, 124, 130)',
        // other
        bodyColor: '#fff',
        borderColor: 'rgb(224, 224, 230)',
    }
}