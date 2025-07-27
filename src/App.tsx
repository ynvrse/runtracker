import { RouterProvider } from 'react-router-dom';

import { router } from './Router';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
