import { createBrowserRouter } from 'react-router';
import App from '../App';
import { NotFound } from '../components/errors/not-found';
import { Home } from '../pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
