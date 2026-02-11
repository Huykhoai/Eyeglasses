import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import { router } from '@/routers/index.tsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext.tsx'
import { NotificationProvider } from './components/ui/Notification/NotificationContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>,
)
