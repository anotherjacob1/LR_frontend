import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@material-ui/core';
import { merge } from 'lodash';

// colors
const primary = '#5294FF';
const primaryDarkDay = 'rgba(82, 148, 255, 0.12)';
const primaryDarkNight = 'rgba(82, 148, 255, 0.2)';

const secondaryMainDay = '#8D97A0';
const secondaryMainNight = '#646464';
const secondaryDarkNight = '#181818';

const black = '#000000';
const white = '#ffffff';

const textPrimaryDay = '#29343E';
const textSecondaryDay = '#8D97A0';
const textPrimaryNight = '#DCDCDC';
const textSecondaryNight = '#646464';

const successMainDay = '#5294FF';
const successDarkDay = '#1EFF78';

const errorMainDay = '#EB4A97';
const errorDarkDay = '#8C43F6';

const warningMainDay = '#EB7A4A';
const warningDarkDay = '#F643CF';

const backgroundDay = '#F2F4F5';
const backgroundNight = '#000000';

const dividerGreyDay = '#E9E9E9';
const dividerGreyNight = '#212121';

// breakpoints
const xl = 1920;
const lg = 1280;
const md = 960;
const sm = 700;
const xs = 0;

// spacing
const spacing = 8;

function createPremiaTheme(
  custom: any,
  options?: ThemeOptions | undefined,
  ...args: object[]
) {
  return createTheme(merge(custom, options), ...args);
}

export const lightTheme = responsiveFontSizes(
  createPremiaTheme({
    palette: {
      action: {
        disabledBackground: '',
        disabled: textSecondaryDay,
      },
      primary: {
        main: primary,
        dark: primaryDarkDay,
      },
      secondary: {
        main: secondaryMainDay,
        dark: backgroundDay,
      },
      common: {
        black,
        white,
      },
      warning: {
        main: warningMainDay,
        dark: warningDarkDay,
      },
      text: {
        primary: textPrimaryDay,
        secondary: textSecondaryDay,
        hint: white,
      },
      background: {
        default: backgroundDay,
        paper: white,
      },
      success: {
        main: successMainDay,
        dark: successDarkDay,
      },
      error: {
        main: errorMainDay,
        dark: errorDarkDay,
      },
      divider: dividerGreyDay,
    },
    typography: {
      fontFamily: 'DM Sans',
      htmlFontSize: 16,
      fontSize: 14,
    },
    breakpoints: {
      values: {
        xl,
        lg,
        md,
        sm,
        xs,
      },
    },
    overrides: {},
  }),
);

export const darkTheme = responsiveFontSizes(
  createPremiaTheme({
    palette: {
      type: 'dark',
      primary: {
        main: primary,
        dark: primaryDarkNight,
      },
      secondary: {
        main: secondaryMainNight,
        dark: secondaryDarkNight,
      },
      common: {
        black,
        white,
      },
      warning: {
        main: warningMainDay,
        dark: warningDarkDay,
      },
      text: {
        primary: textPrimaryNight,
        secondary: textSecondaryNight,
        hint: black,
      },
      background: {
        default: backgroundNight,
        paper: backgroundNight,
      },
      success: {
        main: successMainDay,
        dark: successDarkDay,
      },
      error: {
        main: errorMainDay,
        dark: errorDarkDay,
      },
      divider: dividerGreyNight,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
    typography: {
      fontFamily: 'DM Sans',
      htmlFontSize: 16,
      fontSize: 14,
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      subtitle1: {},
      subtitle2: {},
      body1: {},
      body2: {},
    },
    spacing,
    breakpoints: {
      values: {
        xl,
        lg,
        md,
        sm,
        xs,
      },
    },
    overrides: {},
  }),
);

const theme = { lightTheme, darkTheme };

export default theme;
