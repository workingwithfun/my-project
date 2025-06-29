// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../auth/auth";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    if (getToken()) setIsAuthenticated(true);
  }, []);

const login = (tokens) => {
  saveToken(tokens);  // now saves both access + refresh
  setIsAuthenticated(true);
  axios.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
};

const logout = async () => {
  const { access, refresh } = getToken();  // now gets both tokens

  try {
    if (refresh && access) {
      await axios.post(
        "http://localhost:8000/api/logout/",
        { refresh },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    const { access, refresh } = getToken();

console.log("Access Token:", access);
console.log("Refresh Token:", refresh);

  }

  removeToken();
  setIsAuthenticated(false);
};




  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
