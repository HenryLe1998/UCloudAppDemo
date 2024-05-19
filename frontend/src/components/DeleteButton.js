import React, { useState } from 'react';

function DeleteButton({ fileName, onDelete }) {
  const [deleted, setDeleted] = useState(false); // State to track deletion status

  const handleDelete = async () => {
    try {
      await onDelete(fileName); // Call the onDelete function passed from parent component
      setDeleted(true); // Set deleted state to true upon successful deletion
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Render the delete button
  return (
    <button onClick={handleDelete}>
      {deleted ? 'Delete' : 'Delete'}
    </button>
  );
}

export default DeleteButton;