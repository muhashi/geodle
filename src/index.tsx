import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App.tsx';
import theme from './theme.ts';

import './index.css';
import '@mantine/core/styles.css';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
