import React from "react";
import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary-darkGreen w-full h-full p-11 text-center">
      <div className="w-full m-auto flex justify-center">
        <LogoSnaily className="w-24 h-24 m-auto" />
      </div>

      <div className="mt-12">
        <h1 className="font-bold text-2xl">Login Account Snailly</h1>
      </div>

      <div className="flex gap-3 flex-col mt-5 justify-center items-center">
        <div className="grid w-full max-w-sm items-center text-start gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="
          Type your email here
        "
            className
          />
        </div>

        <div className="grid w-full max-w-sm items-center text-start gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="
          Type your password here
        "
            className
          />
        </div>

        <p className="text-sm text-start">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-secondary-lightOrange2 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>

      <div className="mt-7 flex justify-center items-center flex-col gap-4 ">
        <Button to="/login" className="w-[380px] h-12">
          Login
        </Button>
      </div>
    </div>
  );
};

export default Register;
