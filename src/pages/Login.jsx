import React, { useState } from "react";
import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "notistack";
import { fetcher, fetcherWithToken } from "@/lib/fetch";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    enqueueSnackbar("Logging you in", { variant: "info" });

    try {
      const responseLogin = await fetcher(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        { form }
      );

      const user = await responseLogin.data;

      console.log(user);

      chrome.storage.local.set({ token: user.accessToken }, () => {
        console.log("Token Bearer saved successfully!");
      });

      const responseChildrenList = await fetcher("/child", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const childrenList = await responseChildrenList.data;

      const children = Array.isArray(childrenList)
        ? childrenList[0]
        : childrenList;

      enqueueSnackbar(responseLogin.message, { variant: "success" });

      chrome.storage.local.set({ user: children }, () => {
        console.log("User saved successfully!");
      });

      navigate("/");
    } catch (error) {
      setError(true);
      enqueueSnackbar(
        "Your email or password is incorrect. Please try again.",
        {
          variant: "error",
        }
      );
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
        <Button
          disabled={isLoading || !form.email || !form.password}
          className="w-[380px] h-12"
          onClick={handleSubmit}
        >
          Login
        </Button>
      </div>

      {error && (
        <p className="text-red-400 mt-3 text-sm">
          Your email or password is incorrect. Please try again.
        </p>
      )}
    </div>
  );
};

export default Login;
