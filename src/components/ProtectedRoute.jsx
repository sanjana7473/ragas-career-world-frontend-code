import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const isLoggedIn =
    localStorage.getItem("ragasUserLoggedIn") === "true" ||
    sessionStorage.getItem("ragasUserLoggedIn") === "true";

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/user-login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
