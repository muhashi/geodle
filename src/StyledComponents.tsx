import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {
  Shadows,
  createTheme, responsiveFontSizes, styled,
} from '@mui/material/styles';

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
    backgroundColor: '#dbdbdb',
  },
  border: '3px solid #4d4d4d',
});

type StyledLinkProps = {
  component?: string;
};

// https://css-tricks.com/css-link-hover-effects/
const StyledLink = styled(Link)<StyledLinkProps>({
  position: 'relative',
  display: 'inline-block',
  textDecoration: 'none',
  color: '#000000',
  lineHeight: 1.2,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '3px',
    transformOrigin: 'right center',
    transform: 'scaleX(1)',
    transition: 'transform 400ms cubic-bezier(.2,.8,.2,1)',
    background: 'linear-gradient(to right, #02AAB0, #00CDAC)',
    zIndex: 2,
    pointerEvents: 'none',
    WebkitTransformOrigin: 'right center',
    WebkitTransform: 'scaleX(1)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '3px',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
    transition: 'transform 400ms cubic-bezier(.2,.8,.2,1)',
    background: 'linear-gradient(to right, rgba(255,0,0,1), rgba(255,0,180,1), rgba(0,100,200,1))',
    zIndex: 1,
    pointerEvents: 'none',
    WebkitTransformOrigin: 'left center',
    WebkitTransform: 'scaleX(0)',
  },
  '&:hover::before': {
    transform: 'scaleX(0)',
    WebkitTransform: 'scaleX(0)',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    WebkitTransform: 'scaleX(1)',
  },
});

const StyledTypography = styled(Typography)({
  color: '#000000',
  textAlign: 'center',
});

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: '#4d4d4d',
    },
  },
  typography: {
    fontFamily: [
      'Arial',
      'sans-serif',
    ].join(','),
    subtitle1: {
      fontSize: '0.9rem',
    },
    body2: {
      fontSize: '1.1rem',
    }
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
  },
  // disable all default MUI shadow styling
  shadows: Array(25).fill('none') as Shadows,
}));

export {
  StyledAutocomplete,
  StyledButton,
  StyledLink,
  StyledTypography,
  theme,
};
