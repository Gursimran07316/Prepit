import { Outlet } from "react-router"
import Logout from "../components/Logout"


const DashboardLayout = () => {
  return (<>
    <Logout/>
    <Outlet/>
  </>
  )
}

export default DashboardLayout