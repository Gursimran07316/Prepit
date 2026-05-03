import { StrictMode } from 'react'
import {BrowserRouter} from 'react-router'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/authContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

      <AuthProvider>
       <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      </AuthProvider>

  </BrowserRouter>,
)
