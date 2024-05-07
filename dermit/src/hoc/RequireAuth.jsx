import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContext";
 
export default function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user || !user.token) {
    toast.error("Please login to view this page!");
    return <Navigate to='/login/' state={{from: location.pathname}}/>;
  }
  return children;
}