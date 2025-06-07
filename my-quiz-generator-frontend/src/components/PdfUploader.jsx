// src/components/PdfUploader.jsx
import React, { useState } from 'react';
import Button from './common/Button.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

function PdfUploader({ onFileUpload, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { showNotification } = useNotification();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setFileName(file.name);
      } else {
        setSelectedFile(null);
        setFileName('');
        showNotification('Please select a valid PDF file (.pdf).', 'error');
      }
    } else {
      setSelectedFile(null);
      setFileName('');
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    } else {
      showNotification('No PDF file selected.', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-dashed border-gray-300 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload your PDF</h2>
      <p className="text-gray-600 mb-6">Drag & drop your PDF here, or click to select a file.</p>

      <div className="flex flex-col items-center justify-center space-y-4">
        <label htmlFor="pdf-upload-input" className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors">
          {fileName || 'Choose PDF File'}
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload-input"
        />
        {fileName && <p className="text-gray-700 text-sm mt-2">Selected: <span className="font-medium">{fileName}</span></p>}

        <Button
          onClick={handleUploadClick}
          isLoading={isLoading}
          disabled={!selectedFile || isLoading}
          className="mt-4"
        >
          Generate Quiz
        </Button>
      </div>
    </div>
  );
}

export default PdfUploader;