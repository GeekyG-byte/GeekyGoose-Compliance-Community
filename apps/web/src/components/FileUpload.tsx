'use client'

import { useState } from 'react'

interface UploadedFile {
  id: string
  filename: string
  mime_type: string
  file_size: number
  created_at: string
  download_url: string
}

export default function FileUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://127.0.0.1:8000/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUploadStatus(`✅ Successfully uploaded: ${result.filename}`)
        onUploadComplete?.()
      } else {
        const error = await response.json()
        setUploadStatus(`❌ Upload failed: ${error.detail}`)
      }
    } catch (error) {
      setUploadStatus(`❌ Upload failed: ${error}`)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Drop files here or click to browse
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Supports: PDF, DOCX, TXT, PNG, JPG (max 50MB)
            </p>
          </div>

          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
            className="hidden"
            id="file-input"
            disabled={isUploading}
          />
          
          <label
            htmlFor="file-input"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              'Choose File'
            )}
          </label>
        </div>
      </div>

      {uploadStatus && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 text-sm">
          {uploadStatus}
        </div>
      )}
    </div>
  )
}