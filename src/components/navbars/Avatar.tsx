"use client";

import Image from "next/image";
import React from "react";

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};
type AvatarProps = {
  size?: "sm" | "md" | "lg";
  src: string;
};

export const Avatar = ({ size = "sm", src }: AvatarProps) => {
  return (
    <Image
      className={`rounded-full bg-gray-50 ${sizeClass[size]}`}
      src={src}
      alt=""
      width={32}
      height={32}
    />
  );
};
