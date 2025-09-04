import { createBrowserRouter, Navigate} from "react-router-dom";
import { AuthPageLayout } from "./components/AuthPageLayout";
import { DefaultLayout } from "./components/defaultLayout";
import { Login} from "./views/Login";
import { SignUp } from "./views/SignUp";
import { HomePage } from "./views/HomePage";
import {ProductPage} from "./views/ProductPage"


const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthPageLayout/>,
        children: [
            { 
               path: '/',
               element : <Navigate to="/login"/>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path:'/signup',
                element: <SignUp/>
            }
        ]
   
    },
    {
        path:'/default',
        element:<DefaultLayout/>,
        children: [
            {
                path: '/default',
                element : <Navigate to = "/default/homepage"/>
            },
            {
                path: "/default/homepage",
                element: <HomePage/>
            },
            {
                path : "/default/product/:id",
                element : <ProductPage/>
            }
        ]
    }
])


export default router;