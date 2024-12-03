import React, { useEffect, useState } from "react";
import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const Whitelist = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [newUrl, setNewUrl] = useState("");

  function removeFromWhitelist(index) {
    chrome.storage.local.get(["whitelist"], (result) => {
      let whitelist = result.whitelist || [];

      if (index >= 0 && index < whitelist.length) {
        const removedUrl = whitelist.splice(index, 1);
        chrome.storage.local.set({ whitelist }, () => {
          console.log(`Removed ${removedUrl} from whitelist`);
          renderWhitelist();
          enqueueSnackbar("Website removed from whitelist", {
            variant: "success",
          });
        });
      } else {
        console.error("Invalid index");
        enqueueSnackbar("Invalid index", { variant: "error" });
      }
    });
  }

  const onAddWhitelist = () => {
    chrome.storage.local.get({ whitelist: [] }, (result) => {
      const updatedWhitelist = [...result.whitelist, newUrl];
      chrome.storage.local.set(
        { whitelist: [...new Set(updatedWhitelist)] },
        () => {
          console.log(`${newUrl} added to whitelist.`);
          enqueueSnackbar("Website added to whitelist", { variant: "success" });
          renderWhitelist();
          setNewUrl("");
        }
      );
    });
  };
  const renderWhitelist = () => {
    chrome.storage.local.get({ whitelist: [] }, (result) => {
      console.log(result);
      setData(result.whitelist);
    });
  };

  useEffect(() => {
    renderWhitelist();
  }, []);

  return (
    <div className="bg-primary-darkGreen w-full h-full p-11 text-center">
      <div className="w-full m-auto flex justify-center">
        <LogoSnaily className="w-16 h-16 m-auto" />
      </div>

      <div className="mt-6">
        <h1 className="font-bold text-2xl">
          Here is the list of websites you have whitelisted.
        </h1>
        <p className="text-sm mt-2">
          This list will be used to filter out the websites you trust. You can
          remove websites from this list.
        </p>

        <div className="flex flex-row justify-between w-full items-center mt-2 gap-4">
          <Input
            placeholder="Add a new URL to whitelist"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Button
            onClick={() => onAddWhitelist()}
            className="w-[300px] h-9 rounded-lg"
          >
            Add
          </Button>
        </div>

        <ScrollArea className="h-[200px] rounded-md border p-4  mt-4">
          {data.map((item, index) => (
            <div className="flex flex-row gap-2 w-full justify-between items-center mt-2">
              <p className="text-sm">{item.slice(0, 30)}</p>
              <Button
                className="w-[150px] h-7 rounded-xl flex justify-center items-center flex-col gap-4"
                variant="destructive"
                onClick={() => removeFromWhitelist(index)}
              >
                Delete
              </Button>
            </div>
          ))}
        </ScrollArea>
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
