import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";

const ProtectedRoutesComponent = ({ admin }) => {
    const [isAuth, setIsAuth] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get("/api/get-token");
                console.log("Auth data received:", data);
                if (data.token) {
                    setIsAuth(data.token);
                } else {
                    setIsAuth(false);
                }
            } catch (error) {
                console.error("Error fetching auth token:", error);
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>; // Display loading indicator while checking auth

    console.log("Auth state:", isAuth);

    if (!isAuth) return <Navigate to="/login" />;

    if (admin && isAuth !== "admin") return <Navigate to="/login" />;

    return admin ? (
        <Outlet />
    ) : (
        <>
            <UserChatComponent />
            <Outlet />
        </>
    );
};

export default ProtectedRoutesComponent;