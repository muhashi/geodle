import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, responsiveFontSizes, styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    border: '2px solid #d3d6da',
  },
});

const StyledButton = styled(Button)({
  fontWeight: 600,
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
      main: '#d3d6da',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem',
        },
        root: {
          color: 'red',
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
          tableLayout: 'fixed',
        },
      },
    },
  },
  shadows: ['none'],
}));

export {
  StyledAutocomplete,
  StyledButton,
  StyledLink,
  StyledTableHeaderTypography,
  StyledTypography,
  theme,
};
