import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Providers } from './Providers'

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <Providers />
  </StrictMode>
)
