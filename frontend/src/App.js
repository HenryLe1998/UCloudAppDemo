import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios'
import Submit from './components/submitFile'
import DownloadButton from './components/DownloadButton'
import DeleteButton from './components/DeleteButton'
import './App.css'

async function postImage({image}) {
  try{
    const formData = new FormData();
    formData.append("image", image)

    const result = await axios.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
    return result.data;
  }
  catch (e) {
    console.error("Error uploading image: ", e);
    throw e;
  }
}


function App() {
  const [images, setImages] = useState([])
  const [fileNames, setFileNames] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/files')
        setFileNames(response.data.map(file => file.Key))
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
    fetchFiles()
  }, [images])


  const submitImage = async file => {
    try{
      const result = await postImage({image: file})
      setImages([result.image, ...images])
      setFileNames([file.name, ...fileNames]);
    } catch (e){
      console.error("Error submitting image:", e);
    }
  }
  const deleteFile = async (fileName) => {
    try {
      await axios.delete(`/files/${fileName}`);
      setFileNames(fileNames.filter(name => name !== fileName))
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  return (
    <div className="App">
      <header className='App-header'>
        <h1>U-Clound App Demo</h1>
        <Submit onSubmit={submitImage} />
        <table>
          <thead>
            <tr>
              <td></td>
              <td>File Name</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
          {fileNames.map((fileName, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{fileName}</td>
              <td>
                <DownloadButton url={`/files/${fileName}`} fileName={fileName} />
                <DeleteButton fileName={fileName} onDelete={() => deleteFile(fileName)} />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </header>
    </div>
  )
}
export default App;
