import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import PasswordGate from "./PasswordGate";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PasswordGate>
        <App />
      </PasswordGate>
    </BrowserRouter>
  </React.StrictMode>,
)
