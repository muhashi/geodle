import {
    ActionIcon,
    Badge,
    Button,
    createTheme,
    Modal,
    Paper,
    Text,
} from '@mantine/core';

declare module '@mantine/core' {
  export interface MantineThemeOther {
    pageBackground: string;
    gridLine: string;
  }
}

export const theme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'lg',

  white: '#fffdf7',

  other: {
    pageBackground: '#f2efe6',
    gridLine: 'rgba(35, 43, 61, 0.08)',
  },

  colors: {
    ink: [
      '#EEF0F4',
      '#D3D8E2',
      '#A7B0C4',
      '#7B88A6',
      '#566389',
      '#3A4666',
      '#232B3D',
      '#1B2130',
      '#141926',
      '#0D111C',
    ],
    green: [
      '#EEF5F0',
      '#D4E6DA',
      '#AACDB7',
      '#80B393',
      '#5C9975',
      '#437D5C',
      '#007326',
      '#25503A',
      '#1B3C2B',
      '#12291D',
    ],
    red: [
      '#FBEEEC',
      '#F3D3CC',
      '#E6A99C',
      '#D87F6C',
      '#C85F49',
      '#B44832',
      '#A03B27',
      '#832F1F',
      '#652418',
      '#481A11',
    ],
    yellow: [
      '#FBF3DE',
      '#F3E1B0',
      '#E9CC7E',
      '#DEB755',
      '#D2A23C',
      '#C0902E',
      '#A97A23',
      '#8A621C',
      '#6C4B15',
      '#4E360F',
    ],
  },

  components: {
    Badge: Badge.extend({
      defaultProps: {
        variant: 'outline',
        color: 'ink',
        radius: 'xl',
      },
      styles: {
        root: {
            userSelect: 'none',
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        radius: 'xl',
      },
    }),
    Text: Text.extend({
      defaultProps: {
        c: 'ink.6',
        fw: 500,
      },
    }),
  },
});

export default theme;
