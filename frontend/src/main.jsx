import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './context/store.js'
import router from './router.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AuthContextProvider> */}
    <Provider  store={store}>
       <RouterProvider router={router}/>
    </Provider>      
    {/* </AuthContextProvider> */}
  </StrictMode>,
)
