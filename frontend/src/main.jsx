import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './context/store.js'
import { Toaster } from 'react-hot-toast'
import router from './router.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AuthContextProvider> */}
    <Provider  store={store}>
       <RouterProvider router={router}/>
    </Provider>      
    <Toaster position='top-right' reverseOrder={false}/>
    {/* </AuthContextProvider> */}
  </StrictMode>,
)
