import { createContext, useContext, useState } from "react";
import axios from "axios";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  const signup = async (formData) => {
    const username = formData.get("username");
    const user = {
      username,
    };
    try {
      const { data } = await axios.post(`${API}/signup`, user);
      console.log(data);
      setToken(data.token);
      setLocation("TABLET");
    } catch (error) {
      console.error(error);
    }
  };

  const authenticate = async () => {
    try {
      if (!token) {
        throw Error("No valid token - signup first");
      }
      const { data } = await axios.get(`${API}/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("authenticate response:", data);
      setLocation("TUNNEL");
    } catch (error) {
      console.error(error);
    }
  };

  const value = { token, authenticate, signup, location };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
