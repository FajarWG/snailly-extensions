import React, { useEffect, useState } from "react";
import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    token: "",
    user: null,
    childrenList: null,
  });

  useEffect(() => {
    chrome.storage.local.get(["token"], (result) => {
      setData((prev) => ({ ...prev, token: result.token }));
    });
    chrome.storage.local.get(["user"], (result) => {
      setData((prev) => ({ ...prev, user: result.user }));
    });
    chrome.storage.local.get(["childrenList"], (result) => {
      setData((prev) => ({ ...prev, childrenList: result.childrenList }));
    });
  }, []);

  return (
    <div className="bg-primary-darkGreen w-full h-full p-11 text-center">
      <div className="w-full m-auto flex justify-center">
        <LogoSnaily className="w-24 h-24 m-auto" />
      </div>

      <div className="mt-12">
        <h1 className="font-bold text-2xl">Let me know who are you?</h1>
        <p className="text-lg mt-3">
          Choose one of those role and click continue to access.
        </p>
        <p>{data.token ? "Token: " + data.token : "Token not found."}</p>
        <p>
          {data.user ? "User: " + JSON.stringify(data.user) : "User not found."}
        </p>
        <p>
          {data.childrenList
            ? "Children List: " + JSON.stringify(data.childrenList)
            : "Children List not found."}
        </p>
      </div>

      <div className="mt-12 flex justify-center items-center flex-col gap-4 ">
        <Button onClick={() => navigate("/login")} className="w-[400px] h-12">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Home;
