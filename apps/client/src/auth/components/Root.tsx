import { RouterProvider } from "react-router-dom"
import Header from "../../components/Header"
import { router } from "../../common/routes"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";



export const Root = () => {
  const { pathname } = useLocation();
  return (
    <>
       <Header />
				<RouterProvider router={router} />
    </>
  )
}
