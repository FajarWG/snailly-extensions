import styles from "./style.module.css";
import { setTitle } from "../../utils/generalFunctions";

import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import useAuth from "../../hooks/auth/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const Login = () => {
  setTitle();

  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirection = location.state?.from?.pathname || "/";

  const usernameOrEmailRef = useRef();
  const errRef = useRef();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    usernameOrEmailRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [usernameOrEmail, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/user/login",
        JSON.stringify({ usernameOrEmail, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const username = response?.data?.username;
      const email = response?.data?.email;
      setAuth({ username, email, accessToken });

      setUsernameOrEmail("");
      setPassword("");
      navigate(redirection, { replace: true }); // We redirect to the previous page
    } catch (err) {
      if (!err?.response) {
        setErrMsg("The server didn't respond.");
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      } else if ([400, 401].includes(err.response?.status)) {
        setErrMsg(err.response?.data?.message);
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      } else {
        setErrMsg("Login failed.");
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="bg-primary w-full p-10">
      <img
        src="/logo.png"
        alt="icon"
        className="w-[200px] h-[148px] mx-auto mb-10"
      />
      <div className="flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
              <p
                ref={errRef}
                className={errMsg ? styles.err_message : "hide"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>

                  <Input
                    type="email"
                    id="email"
                    ref={usernameOrEmailRef}
                    autoComplete="off"
                    placeholder="Your email"
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    value={usernameOrEmail}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>
                <div>
                  <Checkbox
                    id="persist_checkBox"
                    checked={JSON.parse(persist)}
                    onChange={togglePersist}
                    className="mr-2"
                  />
                  <label htmlFor="persist_checkBox">Remember me</label>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={!usernameOrEmail || !password ? true : false}
            >
              Login
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
