import React, { useState } from "react";

import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "notistack";
import { fetcher } from "@/lib/fetch";

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const { password, confirmPassword } = form;

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });

      setIsLoading(false);

      return;
    }

    enqueueSnackbar("Registering your account", { variant: "info" });

    try {
      const responseRegister = await fetcher(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        { form }
      );

      const responseLogin = await fetcher(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
        {
          form: {
            email: form.email,
            password: form.password,
          },
        }
      );

      const user = await responseLogin.data;

      const addChildren = await fetcher("/child", {
        method: "POST",
        body: JSON.stringify({ name: form.name }),
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      enqueueSnackbar("Your account has been successfully registered", {
        variant: "success",
      });

      navigate("/login");
    } catch (error) {
      setError(true);
      enqueueSnackbar("An error occurred while registering your account", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary-darkGreen w-full h-full p-11 text-center">
      <div className="w-full m-auto flex justify-center">
        <LogoSnaily className="w-24 h-24 m-auto" />
      </div>
      <div className="mt-12">
        <h1 className="font-bold text-2xl">Register Account Snailly</h1>
      </div>
      <div className="flex gap-3 flex-col mt-5 justify-center items-center">
        <div className="grid w-full max-w-sm items-center text-start gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="
          Type your name here
        "
            onChange={handleChange}
          />
        </div>
        <div className="grid w-full max-w-sm items-center text-start gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="
          Type your email here
        "
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>

        <div className="grid w-full max-w-sm items-center text-start gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="
          Type your password here
        "
            className
            onChange={handleChange}
          />
        </div>

        <p className="text-sm text-start">
          You have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-secondary-lightOrange2 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>

      <div className="mt-7 flex justify-center items-center flex-col gap-4 ">
        <Button
          onClick={handleSubmit}
          className="w-[380px] h-12"
          disabled={
            isLoading ||
            !form.name ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
          }
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default Register;
