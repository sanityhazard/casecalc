import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EditPage from './pages/EditPage.jsx';
import MainPage from './pages/MainPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/edit/" ,
    element: <EditPage />,
  },
  {
    path: "/edit/:filename/" ,
    element: <EditPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
