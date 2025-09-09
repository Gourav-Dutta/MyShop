import { Outlet, Link } from "react-router-dom"


export function AuthPageLayout(){


  return (
   <div className="flex items-center justify-center bg-gray-100 min-h-screen w-full">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <Outlet />
      </div>
    </div>

  )
}