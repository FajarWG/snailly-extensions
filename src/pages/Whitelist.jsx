import React, { useEffect, useState } from "react";
import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";
import { Textarea } from "@/components/ui/textarea";

const Whitelist = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState("Please Wait...");
  const onCopyText = () => {
    navigator.clipboard.writeText(data);
    enqueueSnackbar("Copied to clipboard", { variant: "success" });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      chrome.storage.local.get(["lastSummary"], (result) => {
        setData(result.lastSummary || "In progress...");
      });

      console.log("update summarize");
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="bg-primary-darkGreen w-full h-full p-11 text-center">
      <div className="w-full m-auto flex justify-center">
        <LogoSnaily className="w-24 h-24 m-auto" />
      </div>

      <div className="mt-12">
        <h1 className="font-bold text-2xl">Results of the Summarization</h1>
        <p className="text-sm my-2">
          Here is the summarized text from the website you visited.
        </p>
      </div>

      <div className="grid w-full gap-2">
        <Textarea value={data} />
        <Button onClick={() => onCopyText()}>Copy Summarize</Button>
      </div>

      <Button
        className="w-[400px] bg-blue-500 h-8 mt-8 flex justify-center items-center flex-col gap-4"
        onClick={() => navigate("/")}
      >
        Home
      </Button>
    </div>
  );
};

export default Whitelist;
