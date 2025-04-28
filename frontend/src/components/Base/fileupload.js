"use client";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function Fileuploads({ setFile }) {
  const handleFileUpload = (file) => {
    setFile(file);
  };

  return (
    <div className="w-full mx-auto border border-dashed bg-black rounded-xl">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}

export default Fileuploads;
