'use client'

import { useState, DragEvent, ChangeEvent } from 'react'
import { authFetch } from '../utils/api'

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
  const [lastUploadedFiles, setLastUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadResults, setUploadResults] = useState<{[key: string]: string}>({})
  const [aiProcessingStatus, setAiProcessingStatus] = useState<Record<string, boolean>>({})
  const [showAiCompleteBanner, setShowAiCompleteBanner] = useState(false)
  const [aiCompleteMessage, setAiCompleteMessage] = useState('')

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadMultipleFiles(files)
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadMultipleFiles(Array.from(files))
    }
  }

  const uploadMultipleFiles = async (files: File[]) => {
    if (files.length === 0) return
    
    setIsUploading(true)
    setUploadStatus(`Uploading ${files.length} file${files.length > 1 ? 's' : ''} one at a time...`)
    setUploadResults({})
    setLastUploadedFiles([])
    
    const uploadedFiles: UploadedFile[] = []
    let successful = 0
    let failed = 0

    // Upload files sequentially to prevent connection issues
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      const fileKey = `${file.name}-${index}`

      setUploadStatus(`Uploading file ${index + 1} of ${files.length}: ${file.name}`)

      try {
        const result = await uploadFile(file)
        setUploadResults(prev => ({ ...prev, [fileKey]: '✅ Uploaded' }))
        uploadedFiles.push(result)
        successful++
        
        // Delay between uploads to prevent overwhelming the server
        if (index < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)) // Increased to 2 seconds
        }
      } catch (error: any) {
        let errorMessage = '❌ Failed'
        if (error.message?.includes('timeout')) {
          errorMessage = '⏰ Timeout'
        } else if (error.message?.includes('Connection lost')) {
          errorMessage = '🔌 Connection lost'
        }
        setUploadResults(prev => ({ ...prev, [fileKey]: errorMessage }))
        console.error(`Upload failed for ${file.name}:`, error)
        failed++
      }
    }
    
    setUploadStatus(`Upload complete: ${successful} successful${failed > 0 ? `, ${failed} failed` : ''}`)
    setLastUploadedFiles(uploadedFiles)
    
    // Start polling for AI processing completion (auto-linking happens in background)
    if (uploadedFiles.length > 0) {
      startAiProcessingPolling(uploadedFiles)
    }
    
    setIsUploading(false)
    onUploadComplete?.()
  }

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData()
    formData.append('file', file)

    // Create an AbortController for timeout handling
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 300000) // 5 minute timeout for large files

    try {
      const response = await authFetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
        // Add keep-alive headers to prevent connection drops
        headers: {
          'Connection': 'keep-alive',
        },
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return await response.json()
      } else {
        // Try to parse error as JSON, fallback to text if it fails
        let errorMessage = 'Upload failed'
        try {
          const error = await response.json()
          errorMessage = error.detail || errorMessage
        } catch {
          // Response is not JSON (might be HTML error page)
          const errorText = await response.text()
          errorMessage = errorText || `Upload failed with status ${response.status}`
        }
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      
      const errorMessage = error?.message || String(error)
      const errorName = error?.name || ''
      
      if (errorName === 'AbortError') {
        throw new Error('Upload timeout - file may be too large or server is slow')
      } else if (errorMessage.includes('ECONNRESET') || errorMessage.includes('socket hang up')) {
        throw new Error('Connection lost - please try again')
      } else if (errorMessage.includes('Failed to fetch')) {
        throw new Error('Network error - please check your connection')
      }
      throw new Error(errorMessage || 'Upload failed')
    }
  }

  const startAiProcessingPolling = (uploadedFiles: UploadedFile[]) => {
    // Filter out files without IDs
    const validFiles = uploadedFiles.filter(file => file && file.id)

    if (validFiles.length === 0) {
      console.warn('No valid files to poll for AI processing')
      return
    }

    // Set initial AI processing status
    const initialStatus: Record<string, boolean> = {}
    validFiles.forEach(file => {
      initialStatus[file.id] = false
    })
    setAiProcessingStatus(initialStatus)

    // Process files sequentially instead of polling all at once
    processFilesSequentially(validFiles, 0)
  }

  const processFilesSequentially = async (uploadedFiles: UploadedFile[], currentIndex: number) => {
    if (currentIndex >= uploadedFiles.length) {
      // All files processed
      setAiCompleteMessage(`🎉 AI analysis complete! ${uploadedFiles.length} document${uploadedFiles.length > 1 ? 's' : ''} automatically linked to controls.`)
      setShowAiCompleteBanner(true)
      setTimeout(() => setShowAiCompleteBanner(false), 5000)
      onUploadComplete?.()
      return
    }

    const file = uploadedFiles[currentIndex]

    // Skip if file doesn't have an ID (upload might have failed)
    if (!file || !file.id) {
      console.warn(`Skipping file at index ${currentIndex} - no ID found`)
      processFilesSequentially(uploadedFiles, currentIndex + 1)
      return
    }

    setUploadStatus(`🧠 AI analyzing document ${currentIndex + 1} of ${uploadedFiles.length}: ${file.filename}`)

    // Poll this specific file until completion
    const pollInterval = setInterval(async () => {
      try {
        const response = await authFetch(`/api/documents/${file.id}/ai-status`)
        if (response.ok) {
          const data = await response.json()
          if (data.ai_processed) {
            clearInterval(pollInterval)
            setAiProcessingStatus(prev => ({ ...prev, [file.id]: true }))
            
            // Handle deleted documents gracefully
            if (data.deleted) {
              console.warn(`Document ${file.filename} was deleted during processing`)
            }
            
            // Process next file
            setTimeout(() => {
              processFilesSequentially(uploadedFiles, currentIndex + 1)
            }, 1000) // Small delay between files
          }
        } else if (response.status === 404) {
          // Document was deleted, stop polling and continue with next file
          console.warn(`Document ${file.filename} was deleted, stopping AI status polling`)
          clearInterval(pollInterval)
          processFilesSequentially(uploadedFiles, currentIndex + 1)
        } else {
          // Other errors, log and continue polling for a bit
          console.warn(`AI status check failed for ${file.filename}: ${response.status}`)
        }
      } catch (error) {
        console.error(`Failed to check AI status for ${file.filename}:`, error)
        clearInterval(pollInterval)
        // Continue with next file even if this one fails
        processFilesSequentially(uploadedFiles, currentIndex + 1)
      }
    }, 3000)
    
    // Timeout after 5 minutes per file
    setTimeout(() => {
      clearInterval(pollInterval)
      console.warn(`AI processing timeout for ${file.filename}`)
      processFilesSequentially(uploadedFiles, currentIndex + 1)
    }, 300000)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* AI Processing Complete Banner */}
      {showAiCompleteBanner && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{aiCompleteMessage}</h3>
              <p className="text-xs text-green-600 mt-1">Documents have been automatically linked to their relevant compliance controls.</p>
            </div>
          </div>
        </div>
      )}

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
              Supports: PDF, DOCX, TXT, Images (PNG, JPG, GIF, BMP, TIFF, WebP)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ✨ Select multiple files for batch upload and AI scanning
            </p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              📸 Images are automatically scanned with OCR to extract text
            </p>
          </div>

          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.gif,.bmp,.tiff,.webp"
            className="hidden"
            id="file-input"
            disabled={isUploading}
            multiple
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

      {/* AI Processing Status Indicator */}
      {Object.keys(aiProcessingStatus).length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm font-medium text-blue-900">🧠 AI Analysis in Progress</span>
          </div>
          <div className="text-xs text-blue-700">
            {Object.entries(aiProcessingStatus).map(([fileId, completed]) => {
              const file = lastUploadedFiles.find(f => f.id === fileId)
              if (!file) return null
              return (
                <div key={fileId} className="flex items-center justify-between py-1">
                  <span className="truncate max-w-xs">{file.filename.split('/').pop()}</span>
                  <span className={`ml-2 ${completed ? 'text-green-600' : 'text-blue-600'}`}>
                    {completed ? '✅ Linked' : '⏳ Processing'}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="text-xs text-blue-600 mt-2">
            Documents will be automatically linked to controls when analysis completes.
          </div>
        </div>
      )}
      
      {/* Individual File Upload Results */}
      {Object.keys(uploadResults).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(uploadResults).map(([fileKey, status]) => {
            const fileName = fileKey.split('-').slice(0, -1).join('-') // Remove the index
            return (
              <div key={fileKey} className="flex items-center justify-between text-xs p-2 bg-white border border-gray-200 rounded">
                <span className="flex-1 truncate">{fileName}</span>
                <span className={`ml-2 ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </span>
              </div>
            )
          })}
        </div>
      )}
      
    </div>
  )
}