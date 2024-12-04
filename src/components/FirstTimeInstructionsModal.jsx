import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FirstTimeInstructionsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const onClosed = (keep) => {
    if (!keep) {
      chrome.storage.local.set({ isFirstTime: "false" });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    chrome.storage.local.get(["isFirstTime"], (result) => {
      if (result.isFirstTime != "false") {
        setIsOpen(true);
      }
    });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-black">
            Welcome to Snailly Extensions✨{" "}
          </DialogTitle>
          <DialogDescription>
            Here are some quick instructions to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-black -mt-2">
          <h3 className="font-bold text-base mb-2">1. Explore the Dashboard</h3>
          <p className="text-sm text-muted-foreground mb-3">
            You can view total summary of browsing history here.
          </p>
          <h3 className="font-bold text-base mb-2">
            2. Block Dangerous Website
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Snailly will run in the background and block dangerous websites. You
            can also add websites to the whitelist if you trust them.
          </p>
          <h3 className="font-bold text-base mb-2">3. Summarize The Page</h3>
          <p className="text-sm text-muted-foreground">
            You can summarize the page you are currently visiting by clicking
            the "Summarize This Page" button.
          </p>
        </div>
        <DialogFooter>
          <div className="w-full">
            <Button className="w-full" onClick={() => onClosed(false)}>
              Got it, thanks!
            </Button>
            <p
              onClick={() => onClosed(true)}
              className="text-sm mt-1 text-center text-primary-darkGreen text-muted-foreground cursor-pointer"
            >
              Show this again later
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
