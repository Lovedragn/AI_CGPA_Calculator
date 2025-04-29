"use client";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function Fileuploads({ setFile }) {
  const handleFileUpload = (file) => {
    setFile(file);
  };

  return (
    <div className="w-full mx-auto border-1 border-zinc-600 border-dashed  bg-black rounded-xl pb-2">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}

export default Fileuploads;
