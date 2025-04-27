"use client";
import { useState } from "react";
import Navmenu from "../components/Base/navmenu";
import Fileuploads from "@/components/Base/fileupload";
import { Drawers } from "@/components/Base/drawer";
import { Button } from "@/components/ui/button";

// Load the backend URL from the environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const App = ({ outerfile }) => {
  const [results, setResults] = useState(null);
  const [file, setFile] = useState(outerfile);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file to upload.");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/calculate-cgpa`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process file");
      }

      const result = await res.json();
      setResults(result);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen p-7 gap-10 bg-gradient-to-b from-black to-zinc-950 overflow-hidden">
      <div className="flex flex-col gap-5 bg-gradient-to-b items-center from-black to-zinc-950 w-full max-w-[1200px] min-w-[300px] h-screen max-h-[1080px]">
        <div className="flex w-full justify-start">
          <Navmenu />
        </div>
        <div className="flex flex-col items-center gap-5 w-full ">
          <Fileuploads setFile={setFile} />

          {results ? (
            <h1 className="text-9xl text-white text-shadow-border">
              {results.cgpa}
            </h1>
          ) : (
            ""
          )}

          <Button
            className={`${Loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
            onClick={uploadFile}
            disabled={Loading || !file}
          >
            Upload
          </Button>
          {error && (
            <div className="mt-4 p-3 bg-red-600 text-white-700 font-bold rounded-full">
              <p>{"Upload a Valid PDF !!"}</p>
            </div>
          )}

          <Drawers result={results} />
        </div>
      </div>
    </div>
  );
};

export default App;