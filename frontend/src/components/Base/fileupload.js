"use client";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function Fileuploads({ setFile }) {
  const handleFileUpload = (files) => {
    // Assuming you select only one file
    setFile(files[0]); 
  };

  return (
    <div className="w-full max-w-4xl mx-auto border border-dashed bg-black rounded-xl">
      <FileUpload onChange={handleFileUpload} />
     
    </div>
  );
}

export default Fileuploads;
