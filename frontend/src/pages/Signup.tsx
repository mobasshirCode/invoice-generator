import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import img from "../assets/billboard.png";
import logo from "../assets/wlogo.svg";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

  const Signup: React.FC = () => {
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/login");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Signup failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

      if (!emailRegex.test(form.email)) {
    alert("Please enter a valid email address");
    return;
  }
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
    
      <div className="flex justify-between items-center bg-[#1F1F1F] h-[64px] py-[8px] px-[80px]">
        <img className="w-[141px] h-[48px]" src={logo} alt="" />
        <Button
          variant="secondary"
          className="bg-[#CCF575] text-black hover:bg-lime-500 px-6"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>

      <div className="flex flex-1 bg-black">
        <div className="w-3/5 flex flex-col justify-center px-28 ">
          <h2 className="text-[40px] font-bold mb-2">Sign up to begin journey</h2>
          <p className="text-[20px] text-gray-400 mb-8">
            This is basic signup page which is used for levitation assignment purpose.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-[16px] text-gray-200">
                Enter your name
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter Name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-zinc-900 border border-zinc-700 text-white rounded-[4px] py-[20px] px-[10px]"
              />
              <p className="text-[14px] text-gray-500 mt-1">
                This name will be displayed with your inquiry
              </p>
            </div>

            <div>
              <Label htmlFor="email" className="text-[16px] text-gray-200">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Email ID"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-zinc-900 border border-zinc-700 text-white rounded-[4px] py-[20px] px-[10px]"
              />
              <p className="text-[14px] text-gray-500 mt-1">
                This email will be displayed with your inquiry
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-[16px] text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-zinc-900 border border-zinc-700 text-white rounded-[4px] py-[20px] px-[10px]"
              />
              <p className="text-[14px] text-gray-500 mt-1">
                Any further updates will be forwarded on this Email ID
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className=" bg-[#303030] text-[#CCF575] text-[16px] hover:bg-[#CCF575] hover:text-[#303030] rounded-[4px] py-[15px] px-[20px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Register"}
              </Button>
              <p className="text-[14px] text-gray-400">
                Already have account?{" "}
                <span
                  className="text-lime-400 cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>

        <div className="w-full h-[733px] pt-[150px] pl-[220px] overflow-hidden">
          <img
            src={img}
            alt="Signup Banner"
            className="h-full w-full object-cover rounded-l-[60px] "
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
