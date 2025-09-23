import { createBrowserRouter, Navigate} from "react-router-dom";
import { AuthPageLayout } from "./components/AuthPageLayout";
import { DefaultLayout } from "./components/defaultLayout";
import { Login} from "./views/Login";
import { SignUp } from "./views/SignUp";
import { HomePage } from "./views/HomePage";
import {ProductPage} from "./views/ProductPage"
import { LoginRequest } from "./views/requestToLogin";
import { Cart } from "./views/cart";
import { ProductListPage } from "./views/ProductListPage";
import { Order } from "./views/order";
import { MyProfile } from "./views/MyProfile";
import { UpdateProfile } from "./views/UpdateProfile";
import { AddAddress } from "./views/AddAddress";
import { UpdateAddress } from "./views/UpdateAddress";


const router = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthPageLayout/>,
        children: [
            { 
               path: '/auth',
               element : <Navigate to="/auth/login"/>
            },
            {
                path: '/auth/login',
                element: <Login/>
            },
            {
                path:'/auth/signup',
                element: <SignUp/>
            },
            {
                path: '/auth/requestLogin',
                element: <LoginRequest/>
            },
           
        ]
   
    },
    {
        path:'/',
        element:<DefaultLayout/>,
        children: [
            {
                path: '/',
                element : <Navigate to = "/homepage"/>
            },
            {
                path: "/homepage",
                element: <HomePage/>
            },
            {
                path : "/product/:id",
                element : <ProductPage/>
            },
            {
                path: "/cart",
                element: <Cart/>
            },
            {
                path: "/productList/:Search_Item",
                element: <ProductListPage/>
            },
            {
                path: "/orders",
                element: <Order/>
            },
            {
                path : "/myProfile",
                element: <MyProfile/>
            },
            {
                path : "/update/profile",
                element : <UpdateProfile/>
            },
            {
                path : "/new/address",
                element : <AddAddress/>
            },
            {
                path : "/update/address/:addId",
                element : <UpdateAddress/>
            }
        ]
    }
])


export default router;