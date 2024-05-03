import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const tokenData = localStorage.getItem("token");
    setUser(userData);
    setToken(tokenData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user?.role))) {
      navigate("/login");
    }
  }, [isLoading, user, allowedRoles, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-redpallete">
          Loading <span className="animate-pulse">...</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
