import { RouterProvider } from 'react-router-dom';

import { router } from './Router';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="run-tracker-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
