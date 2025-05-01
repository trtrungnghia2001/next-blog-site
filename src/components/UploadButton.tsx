"use client";

import { ImageUp } from "lucide-react";
import {
  CldUploadWidget,
  CldUploadWidgetProps,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import React, { FC, memo, useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import clsx from "clsx";

interface IUploadButton extends CldUploadWidgetProps {
  image?: string;
  onChangeImage?: (value: string) => void;
  avatar?: boolean;
}

const UploadButton: FC<IUploadButton> = ({
  image,
  onChangeImage,
  avatar,
  ...props
}) => {
  const [preview, setPrivew] = useState("");
  useEffect(() => {
    if (image) {
      setPrivew(image);
    }
  }, [image]);

  useEffect(() => {
    if (preview && onChangeImage) {
      onChangeImage(preview);
    }
  }, [preview]);

  return (
    <div className="space-y-2">
      {preview && (
        <div
          className={clsx([
            `relative overflow-hidden`,
            avatar
              ? `aspect-square rounded-full w-20`
              : `aspect-video w-40 rounded`,
          ])}
        >
          <Image src={preview} alt="img" fill />
        </div>
      )}
      <div>
        <CldUploadWidget
          {...props}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDINARY_PRESET}
          config={{
            cloud: {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            },
          }}
          onSuccess={(results) => {
            setPrivew((results?.info as CloudinaryUploadWidgetInfo).url);
          }}
        >
          {({ open }) => (
            <Button
              size={"sm"}
              type="button"
              onClick={() => open()}
              className="max-w-max"
            >
              <ImageUp />
              Upload Image
            </Button>
          )}
        </CldUploadWidget>
      </div>
    </div>
  );
};

export default memo(UploadButton);
