import React, { useContext, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const Login = () => {
  const [userType, setUserType] = useState("Admin");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = userType === "Admin" 
        ? "http://localhost:4000/api/admin/login"
        : `${backendUrl}/api/doctor/login`;

      const response = await axios.post(endpoint, formData);
      
      if (response.data.success) {
        const token = response.data.token;
        if (userType === "Admin") {
          setAToken(token);
          localStorage.setItem("aToken", token);
          toast.success("Admin login successful");
        } else {
          setDToken(token);
          localStorage.setItem("dToken", token);
          toast.success("Doctor login successful");
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during login";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserType = () => {
    setUserType(prev => prev === "Admin" ? "Doctor" : "Admin");
    setFormData({ email: "", password: "" }); // Clear form when switching
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{userType}</span> Login
        </p>
        
        <div className="w-full">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-[#DADADA] rounded w-full p-2"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="border border-[#DADADA] rounded w-full p-2"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center w-full">
          {userType === "Admin" ? "Doctor" : "Admin"} Login?{" "}
          <button
            type="button"
            onClick={toggleUserType}
            className="text-primary underline cursor-pointer"
            disabled={isLoading}
          >
            Click here
          </button>
        </p>
      </div>
    </form>
  );
};

export default Login;