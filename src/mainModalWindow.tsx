import React from 'react'
import ReactDOM from 'react-dom/client'
import AppModalWindow from './AppModalWindow.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'

ReactDOM.createRoot(document.getElementById('modal-root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <AppModalWindow />
    </NextUIProvider>
  </React.StrictMode>,
)

