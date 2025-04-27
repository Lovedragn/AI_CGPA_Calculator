"use client";
import { useState } from "react";
import Navmenu from "../components/Base/navmenu";
import Fileuploads from "@/components/Base/fileupload";
import { Drawers } from "@/components/Base/drawer";

const App = ({outerfile}) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(outerfile);
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
    <div className="bg-gradient-to-b from-black to-zinc-700 w-full h-screen flex flex-col items-center p-4 overflow-hidden">
       <div>
        <Navmenu />
      </div>

      <Fileuploads setFile={setFile} />
      
      <div>
        <Drawers result={results} />
      </div>
      {/* <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <input
          className="w-full border border-gray-300 rounded p-2 text-sm"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          className={`w-full py-2 px-4 rounded font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={uploadFile}
          disabled={loading || !file}
        >
          {loading ? "Processing..." : "Calculate CGPA"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{"Upload a Valid PDF Result"}</p>
          </div>
        )}

        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center mb-4">
              <span className="text-gray-600 text-sm">Your CGPA</span>
              <h2 className="text-5xl font-bold text-blue-600">
                {results.cgpa}
              </h2>
              <p className="text-sm mt-1 text-gray-500">
                {results.college === "anna_university"
                  ? "Anna University"
                  : "GRT IET"}
              </p>
            </div>

            {results.student_info && (
              <div className="mb-4 border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Student Information
                </h3>
                <p className="text-sm">
                  <span className="font-medium">Name:</span>{" "}
                  {results.student_info.Student_Name || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Register Number:</span>{" "}
                  {results.student_info.Register_Number || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Branch:</span>{" "}
                  {results.student_info.Branch || "N/A"}
                </p>
              </div>
            )}

            {results.courses && results.courses.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Course Details
                </h3>
                <div className="text-sm max-h-40 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-1">Code</th>
                        <th className="text-left p-1">Grade</th>
                        <th className="text-right p-1">Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.courses.map((course, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-1">{course.Course_Code}</td>
                          <td className="p-1">{course.Grade}</td>
                          <td className="p-1 text-right">{course.Credits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} 
          </div>
        )}
      </div> */}
    </div>
  );
};

export default App;
