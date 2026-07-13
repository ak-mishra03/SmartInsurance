import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {

    setLoading(true);

    const token =
      localStorage.getItem("access");

    // User not logged in
    if (!token) {

      setUser(null);

      setLoading(false);

      return;

    }

    try {

      const response =
        await api.get("/auth/me/");

      setUser(response.data);

    }

    catch (error) {

      console.error(error);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setUser(null);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchUser();

  }, []);

  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        logout,
        setUser,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}
