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
import { SellerLayout } from "./components/SellerLayout";
import { SellerSearchProductPage } from "./views/vendor/SellerSearchProductPage";
import { SellerPortal } from "./views/vendor/SellerPortal";
import { SellerAllProduct } from "./views/vendor/SellerAllProduct";
import { SellerAddProduct } from "./views/vendor/SellerAddProduct";
import { SellerProductVerietyPage } from "./views/vendor/SellerProductVerietyPage";
import { SellerAddProductVeriety } from "./views/vendor/SellerAddProductVeriety";
import { SellerAddProductVerietyImage } from "./views/vendor/SellerAddProductVerietyImage";
import { SellerAllOrders } from "./views/vendor/SellerAllOrders";
import { SellerUpdateOrder } from "./views/vendor/SellerUpdateOrder";
import { SellerUpdateProductVariety } from "./views/vendor/SellerUpdateProductVariety";
import { SellerUpdateProductPage } from "./views/vendor/SellerUpdateProductPage";
import { SellerProfilePage } from "./views/vendor/SellerProfilePage";
import { SellerUpdateProfilePage } from "./views/vendor/SellerUpdateProfilePage";
import { SellerAddNewAddress } from "./views/vendor/SellerAddNewAddress";
import { SellerUpdateAddressPage } from "./views/vendor/SellerUpdateAddressPage";
import { SellerSignUpPage } from "./views/vendor/SellerSignUpPage";
import { AllProductPage } from "./views/AllProductPage";
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
            {
                path: "/auth/seller/signup",
                element: <SellerSignUpPage/>
            }
           
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
            },
            {
                path: "/allProductPage",
                element: <AllProductPage/>
            }
        ]
    },
    {
        path: "/seller/layout",
        element: <SellerLayout/>,
        children: [
            
            {
                path: '/seller/layout',
                element : <Navigate to = "/seller/layout/sellerDashboard"/>
            },
            {
                path: "/seller/layout/sellerDashboard",
                element: <SellerPortal/>
            },
            {
                path: "/seller/layout/seller/products/:Search_Item",
                element : <SellerSearchProductPage/>
            },
            {
                path: "/seller/layout/product",
                element : <SellerAllProduct/>
            },
            {
               path: "/seller/layout/addProduct",
               element: <SellerAddProduct/>
            },
            {
                path: "/seller/layout/productVeriety/:productId",
                element: <SellerProductVerietyPage/>
            },
            {
                path: "/seller/layout/add/productVeriety/:productId",
                element: <SellerAddProductVeriety/>
            },
            {
                path : "/seller/layout/add/productVarietyImage/:productVerietyId",
                element: <SellerAddProductVerietyImage/>
            },
            {
                path : "/seller/layout/order/All",
                element: <SellerAllOrders/>
            },
            {
                path: "/seller/layout/update/order/:orderId/:currentOrderStatus",
                element: <SellerUpdateOrder/>
            },
            {
                path: "/seller/layout/update/productVariety/:varietyId",
                element: <SellerUpdateProductVariety/>
            },
            {
                path: "/seller/layout/update/product/:productId",
                element: <SellerUpdateProductPage/>
            },
            {
                path: "/seller/layout/myProfile",
                element: <SellerProfilePage/>
            },
            {
                path: "/seller/layout/update/profile",
                element: <SellerUpdateProfilePage/>
            },
            {
                path: "/seller/layout/add/Address",
                element: <SellerAddNewAddress/>
            },
            {
                path: "/seller/layout/update/Address/:addId",
                element: <SellerUpdateAddressPage/>
            }
        ]
    }
])


export default router;