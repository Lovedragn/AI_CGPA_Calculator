"use client";
import { useState } from "react";
import Navmenu from "../components/Base/navmenu";
import Fileuploads from "@/components/Base/fileupload";
import { Drawers } from "@/components/Base/drawer";
import { Button } from "@/components/ui/button";

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
      const res = await fetch("http://localhost:5000/calculate-cgpa", {
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
    <div className="flex flex-col items-center w-full h-screen p-7  gap-10 bg-gradient-to-b  from-black to-zinc-950  overflow-hidden">
      <div className="flex flex-col bg-gradient-to-b items-center gap-10 from-black to-zinc-950 w-full max-w-[1200px] min-w-[300px] h-screen">
        <div className="flex w-full h-max">
          <Navmenu />
        </div>

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
          <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{"Upload a Valid PDF Result"}</p>
          </div>
        )}

        <Drawers result={results} />
      </div>
    </div>
  );
};

export default App;
