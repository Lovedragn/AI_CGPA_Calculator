"use client";
import { useState } from "react";
import Navmenu from "../components/Base/navmenu";
import Fileuploads from "@/components/Base/fileupload";
import { Drawers } from "@/components/Base/drawer";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

// Load the backend URL from the environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    <div className="flex flex-col items-center w-full h-screen justify-between p-7 gap-10 bg-gradient-to-tr from-black to-zinc-800 overflow-hidden">
      <div className="flex flex-col gap-5 bg-gradient-to-tr items-center from-black to-zinc-800 w-full max-w-[1200px] min-w-[300px] max-h-[1080px]">
        <div className="flex w-full justify-start">
          <Navmenu />
        </div>
        <div className="flex flex-col items-center gap-5 w-full ">
          <Fileuploads setFile={setFile} />

          {results ? (
            <h1 className="text-7xl lg:text-9xl text-white text-shadow-border font-bold">
              {results.cgpa}
            </h1>
          ) : (
            <p className="relative z-20 font-thin text-zinc-400 text-sm mt-2 text-center">
              <span className="font-bold text-gray-300">Accurate results</span>{" "}
              for students who have passed all subjects.
              <br /> For concerns, please contact{" "}
              <a
                href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                className="underline font-bold text-white"
              >
                sujith.sappani@gmail.com
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col item-center h-full w-full p-5 ">
        <div className="flex flex-col item-center justify-end pb-15 gap-5 h-full w-full">
          <Button
            className={`${Loading ? "bg-gray-400 cursor-not-allowed" : ""}` }
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

          {results !=null ? <Drawers result={results}/> : "" }
        </div>

        <footer className="text-[10px] text-center text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} AI CGPA Calculator | GRTIET | SSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
