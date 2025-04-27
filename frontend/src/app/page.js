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
    <div className="bg-gradient-to-b from-black to-zinc-900 w-full h-screen flex flex-col items-center p-4 overflow-hidden">
      <div>
        <Navmenu />
      </div>

      <Fileuploads setFile={setFile} />
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
      <h2 className="text-5xl font-bold text-blue-600">
        {results ? <h1 className="text-9xl text-white text-shadow-border">{results.cgpa}</h1> : ""}
       
      </h2>
      <div>
        <Drawers result={results} />
      </div>
     
    </div>
  );
};

export default App;
