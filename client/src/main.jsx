
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SharedDataProvider } from './context/SharedDataContext'


createRoot(document.getElementById('root')).render(
        <SharedDataProvider >
                <App />   
        </SharedDataProvider>   
)
