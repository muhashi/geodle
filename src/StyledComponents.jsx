import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, responsiveFontSizes, styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)({
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '3px solid #4d4d4d',
  },
  color: '#000000',
});

const StyledButton = styled(Button)({
  fontWeight: 600,
  color: '#000000',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: '#b3b3b3',
    color: '#FFFFFF',
  },
  border: '3px solid #4d4d4d',
});

// https://css-tricks.com/css-link-hover-effects/
const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: '#000000',
  background:
    `linear-gradient(
      to right,
      rgba(100, 200, 200, 1),
      rgba(100, 200, 200, 1)
    ),
    linear-gradient(
      to right,
      rgba(255, 0, 0, 1),
      rgba(255, 0, 180, 1),
      rgba(0, 100, 200, 1)
    )`,
  backgroundSize: '100% 3px, 0 3px',
  backgroundPosition: '100% 100%, 0 100%',
  backgroundRepeat: 'no-repeat',
  transition: 'background-size 400ms',
  '&:hover': {
    backgroundSize: '0 3px, 100% 3px',
    textDecoration: 'none',
  },
});

const StyledTypography = styled(Typography)({
  color: '#000000',
  textAlign: 'center',
});

const StyledTableHeaderTypography = styled(StyledTypography)({
  inlineSize: 'min-content',
  '@media (max-width: 680px)': {
    writingMode: 'vertical-rl',
  },
});

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: '#4d4d4d',
    },
  },
  typography: {
    description: {
      fontSize: '0.9rem',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem',
        },
      },
      defaultProps: {
        arrow: true,
        enterTouchDelay: 0,
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#f7f7f7',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px',
          '@media (max-width: 680px)': {
            padding: '8px 0',
          },
        },
      },
    },
  },
  shadows: ['none', 'none'],
}));

export {
  StyledAutocomplete,
  StyledButton,
  StyledLink,
  StyledTableHeaderTypography,
  StyledTypography,
  theme,
};
