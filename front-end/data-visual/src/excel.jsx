import React, { useState } from "react";
import axios from "axios";

const ExcelUploader = () => {
  // State to hold the selected file and the data received from FastAPI
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);  // State to hold the data from FastAPI
  const [error, setError] = useState(null); // State to hold any errors

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure you're setting this header
        },
      });
  
      setData(response.data); // Set the response data
      setError(null); // Reset any errors
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
      setData(null);
    }
  };
  
  return (
    <div>
      <h1>Upload Excel File</h1>

      {/* File input */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

      {/* Upload button */}
      <button onClick={handleUpload}>Upload</button>

      {/* Display loading, errors or data */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div>
          <h3>Data from Excel:</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
