import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/mockQueryClient';
import { queryClient } from '@/lib/mockQueryClient';

interface FileUploaderProps {
  onUploadComplete: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesProcessed, setFilesProcessed] = useState({ current: 0, total: 0 });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  const browseFiles = () => {
    fileInputRef.current?.click();
  };

  const validateAndStoreFiles = (incomingFiles: File[]) => {
    const newFiles = [...selectedFiles];
    for (const file of incomingFiles) {
      if (!validFileTypes.includes(file.type)) {
        toast({
          title: 'Invalid file format',
          description: `${file.name} is not supported.`,
          variant: 'destructive',
        });
        continue;
      }
      if (newFiles.length >= 10) {
        toast({
          title: 'Limit reached',
          description: 'You can only upload up to 10 files.',
          variant: 'destructive',
        });
        break;
      }
      newFiles.push(file);
    }
    setSelectedFiles(newFiles.slice(0, 10)); // Ensure max 10
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndStoreFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndStoreFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // const handleSubmit = async () => {
  //   if (selectedFiles.length === 0) {
  //     toast({
  //       title: 'No files selected',
  //       description: 'Please upload at least one file before submitting.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }
  
  //   setIsUploading(true);
  //   setUploadProgress(0);
  //   setFilesProcessed({ current: 0, total: selectedFiles.length });
  //   setUploadSuccess(false);
  
  //   const formData = new FormData();
  //   formData.append('job_description', 'Project management.'); // <-- Add job_description
  
  //   selectedFiles.forEach((file) => {
  //     formData.append('cvs', file); // API expects `cvs` as repeated key
  //   });
  
  //   try {
  //     const uploadRes = await fetch('http://localhost:8000/api/analyze-cvs/', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!uploadRes.ok) {
  //       throw new Error('Upload failed');
  //     }
  
  //     let processed = 0;
  //     const checkStatus = setInterval(async () => {
  //       try {
  //         const statusRes = await fetch('http://localhost:8000/api/resumes/status');
  //         const statusData = await statusRes.json();
  
  //         processed = statusData.processed;
  //         const percent = Math.round((processed / selectedFiles.length) * 100);
  //         setUploadProgress(percent);
  //         setFilesProcessed({ current: processed, total: selectedFiles.length });
  
  //         if (processed >= selectedFiles.length || statusData.status === 'completed') {
  //           clearInterval(checkStatus);
  //           setUploadSuccess(true);
  //           setSuccessCount(processed);
  
  //           setTimeout(() => {
  //             setIsUploading(false);
  //             setSelectedFiles([]);
  //             queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
  //             queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
  //             onUploadComplete();
  //           }, 3000);
  //         }
  //       } catch {
  //         clearInterval(checkStatus);
  //         toast({
  //           title: 'Error checking status',
  //           description: 'Failed to check processing status.',
  //           variant: 'destructive',
  //         });
  //       }
  //     }, 1000);
  //   } catch {
  //     setIsUploading(false);
  //     toast({
  //       title: 'Upload failed',
  //       description: 'There was an error uploading your files. Please try again.',
  //       variant: 'destructive',
  //     });
  //   }
  // };
  
  
  const handleSubmit = async (e:any) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('job_description', 'Job description'); // Make sure jobDescription is a state variable
  
    // Append all selected files at once (not one-by-one each submit)
    for (const file of selectedFiles) {
      formData.append('cvs', file);
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/analyze-cvs/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Response:', result);
      // Optionally update state with result
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  const cancelUpload = () => {
    setIsUploading(false);
    toast({
      title: 'Upload cancelled',
      description: 'Resume upload has been cancelled.',
      variant: 'default',
    });
  };

  return (
    <div className="mb-8" id="upload-section">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Resumes</h2>

        {isUploading ? (
          !uploadSuccess ? (
            <div id="upload-progress">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading and analyzing resumes...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>{filesProcessed.current}/{filesProcessed.total} files processed</span>
                <button className="text-red-500 hover:text-red-700" onClick={cancelUpload}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div id="upload-success">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      {successCount} resumes successfully uploaded and analyzed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragging ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
              } transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={browseFiles}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">Drag and drop resume files here or click to browse</p>
              <p className="text-gray-500 text-sm">Supported formats: PDF, DOCX, DOC (Max 10 files)</p>
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                multiple
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <button className="mt-4 bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Select Files
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2 text-gray-700">Selected Files</h3>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>

                <button
                  onClick={handleSubmit}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
