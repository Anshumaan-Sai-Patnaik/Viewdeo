import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || "http://localhost:5173";

const bounceToPublic = () => {
  window.location.href = PUBLIC_URL;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        setStatus("ready");
      })
      .catch(() => {
        bounceToPublic();
      });
  }, []);

  if (status !== "ready") {
    return;
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}