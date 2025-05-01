"use client";
import React, { ComponentProps, FC, memo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const ButtonDeleteConfirm: FC<ComponentProps<"button">> = ({ onClick }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"sm"} variant={"destructive"} className="text-xs">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove your data
            from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={onClick}
            size={"sm"}
            variant={"destructive"}
            className="text-xs"
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button size={"sm"} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ButtonDeleteConfirm);
