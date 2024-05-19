import React, { useState, useEffect } from "react";
import axios from "axios";

const ListFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("/files"); // Endpoint to fetch files from backend
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
    fetchFiles();
  }, [files])

  return (
    <div>
      <h1>List of files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.Key}>{file.Key}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListFiles;