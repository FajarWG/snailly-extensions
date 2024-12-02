import React, { useEffect, useState } from "react";
import { LogoSnaily } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { fetcher, fetcherWithToken } from "@/lib/fetch";
import { useSnackbar } from "notistack";

const Home = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({
    user: {
      name: "User",
    },
    token: "",
  });

  const [listOfSummary, setListOfSummary] = useState({
    totalSafeWebsites: 0,
    totalDangerousWebsites: 0,
  });

  const onLogout = () => {
    chrome.storage.local.remove(["token"], () => {
      enqueueSnackbar("Logout successfully", { variant: "success" });
    });
    chrome.storage.local.remove(["user"], () => {
      enqueueSnackbar("Logout successfully", { variant: "success" });
    });
    navigate("/login");
  };

  useEffect(() => {
    chrome.storage.local.get(["token"], (result) => {
      console.log(result);

      if (!result.token) {
        navigate("/login");
      }
      setData((prev) => ({ ...prev, token: result.token }));
    });

    chrome.storage.local.get(["totalDangerousWebsites"], (result) => {
      if (result.totalDangerousWebsites) {
        setListOfSummary((prev) => ({
          ...prev,
          totalDangerousWebsites: result.totalDangerousWebsites,
        }));
      }
    });

    chrome.storage.local.get(["totalSafeWebsites"], (result) => {
      if (result.totalSafeWebsites) {
        setListOfSummary((prev) => ({
          ...prev,
          totalSafeWebsites: result.totalSafeWebsites,
        }));
      }
    });

    chrome.storage.local.get(["user"], (result) => {
      console.log(result);
      setData((prev) => ({ ...prev, user: result.user }));
    });
  }, []);

  return (
    <div className="bg-primary-darkGreen w-full h-full p-11 text-center">
      <div className="w-full m-auto flex justify-center">
        <LogoSnaily className="w-24 h-24 m-auto" />
      </div>

      <div className="mt-12">
        <h1 className="font-bold text-2xl">Welcome User Snailly✨</h1>
        <p className="text-sm my-2">
          This is total content that you have accessed
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Accessed Content
                </p>
                <p className="text-3xl font-bold text-[#8BA446]">
                  {listOfSummary.totalDangerousWebsites +
                    listOfSummary.totalSafeWebsites}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Positive Content
                </p>
                <p className="text-3xl font-bold text-[#0066FF]">
                  {listOfSummary.totalSafeWebsites}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Negative Content
                </p>
                <p className="text-3xl font-bold text-[#FF4444]">
                  {listOfSummary.totalDangerousWebsites}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex justify-center items-center flex-col gap-4 ">
        <Button
          onClick={() => onLogout()}
          className="w-[400px] h-12"
          variant="destructive"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Home;
