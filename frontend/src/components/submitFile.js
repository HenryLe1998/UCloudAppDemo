import React, { useState } from 'react';
import './errorBox.css'

function Submit({ onSubmit }) {
  const [file, setFile] = useState()
  const [errorMessage, setErrorMessage] = useState("");

  const fileSelected = event => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (!file) {
        throw new Error("No file selected");
      }
      await onSubmit(file);
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(error.message)
    }
  };
  //clear the error message
  const handleClose = () => {
    setErrorMessage("");
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input onChange={fileSelected} type="file" accept="image/*"></input>
            <button type="submit">Submit</button>
        </form>
        {errorMessage && (
            <div className="error-box">
                <span className="close-button" onClick={handleClose}><button type="close">x</button></span>
                <p>{errorMessage}</p>
            </div>
        )}
    </div>
  );
}

export default Submit;