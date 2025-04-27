"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function Fileuploads() {
  const [files, setFiles] = useState([]);
  const handleFileUpload = (files) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto border border-dashed bg-black rounded-xl">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}

export default Fileuploads;