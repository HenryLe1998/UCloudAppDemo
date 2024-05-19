import React from 'react';

const DownloadButton = ({ fileName }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/files/${fileName}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return <button onClick={handleDownload}>Download</button>;
};

export default DownloadButton;