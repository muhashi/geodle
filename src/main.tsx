import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import './index.css';
import '@mantine/core/styles.css';


export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
);
