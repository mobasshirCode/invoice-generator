import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import img1 from "../assets/slider1.png";
import img2 from "../assets/slider2.jpg";
import logo from "../assets/wlogo.svg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  // slider here (keen slider)
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    slides: {
    perView: 1.2,  
    spacing: 24,  
  },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (slider) {
      interval = setInterval(() => {
        slider.current?.next();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [slider]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Login failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex justify-between items-center bg-[#1F1F1F] h-[64px] py-[8px] px-[80px]">
        <img className="w-[141px] h-[48px]" src={logo} alt="" />
        <Button
          variant="secondary"
          className="bg-[#303030] text-[#CCF575] text-[14px] border border-[#CCF575] hover:bg-[#CCF575] hover:text-[#303030] rounded-[4px] px-6 w-[77px] h-[41px]"
          onClick={() => navigate("/")}
        >
          Signup
        </Button>
      </div>

      <div className="flex flex-1">
<div className="w-1/2 flex items-center pl-14">
  <div ref={sliderRef} className="keen-slider h-[600px]">
    <div className="keen-slider__slide number-slide1">
      <img
        src={img1}
        alt="Banner 1"
        className="h-full object-cover rounded-[40px]"
      />
    </div>
    <div className="keen-slider__slide number-slide2">
      <img
        src={img2}
        alt="Banner 2"
        className="h-full object-cover rounded-[40px]"
      />
    </div>
  </div>
</div>

        <div className="w-1/2 flex flex-col justify-center px-36">
          <div className="mb-10">
        <img className="w-[215px] h-[73px]" src={logo} alt="" />
          </div>

          <h2 className="text-[40px] font-bold mb-2">Let the Journey Begin!</h2>
          <p className="text-[20px] text-gray-400 mb-8">
            This is basic login page which is used for levitation assignment purpose.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                Current Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter the Password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-zinc-900 border border-zinc-700 text-white rounded-[4px] py-[20px] px-[10px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="bg-[#303030] text-[#CCF575] text-[16px] hover:bg-[#CCF575] hover:text-[#303030] rounded-[4px] py-[15px] px-[20px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Login now"}
              </Button>
              <span className="text-sm text-gray-400 cursor-pointer hover:underline">
                Forgot password ?
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
