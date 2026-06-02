'use client'

import { useState, useEffect } from 'react'
import { authFetch } from '../utils/api'

interface Document {
  id: string
  filename: string
  mime_type: string
  file_size: number
  sha256: string
  created_at: string
  download_url: string
  ai_processed: boolean
  control_links: Array<{
    control_id: string
    control_code: string
    control_title: string
    confidence: number
    reasoning: string
  }>
}

interface Framework {
  id: string
  name: string
  version: string
}

interface Control {
  id: string
  code: string
  title: string
  framework_id: string
}

interface ControlMapping {
  file_id: string
  filename: string
  control_code: string
  control_title: string
  framework_name: string
  confidence: number
  reasoning: string
  created_at: string
}

export default function DocumentList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [controlMappings, setControlMappings] = useState<ControlMapping[]>([])
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [controls, setControls] = useState<Control[]>([])
  const [selectedFramework, setSelectedFramework] = useState<string>('')
  const [selectedControls, setSelectedControls] = useState<string[]>([])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await authFetch('/api/documents')
      
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
        setError(null)
      } else {
        throw new Error('Failed to fetch documents')
      }
    } catch (err) {
      setError('Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const response = await authFetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments(docs => docs.filter(doc => doc.id !== documentId))
      } else {
        throw new Error('Failed to delete document')
      }
    } catch (err) {
      alert('Failed to delete document')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('text')) return '📃'
    if (mimeType.includes('image')) return '🖼️'
    return '📁'
  }

  useEffect(() => {
    fetchDocuments()
    loadControlMappings()
  }, [refreshTrigger])
  
  const loadControlMappings = () => {
    try {
      const mappings = localStorage.getItem('document_control_mappings')
      if (mappings) {
        setControlMappings(JSON.parse(mappings))
      }
    } catch (error) {
      console.error('Failed to load control mappings:', error)
    }
  }
  
  const getDocumentMappings = (documentId: string) => {
    return controlMappings.filter(mapping => mapping.file_id === documentId)
  }
  
  const removeMapping = (documentId: string, controlCode: string) => {
    const updatedMappings = controlMappings.filter(
      mapping => !(mapping.file_id === documentId && mapping.control_code === controlCode)
    )
    setControlMappings(updatedMappings)
    localStorage.setItem('document_control_mappings', JSON.stringify(updatedMappings))
  }

  const isProcessingFailed = (doc: Document) => {
    // Document is considered failed if:
    // 1. Not AI processed AND
    // 2. No control links AND
    // 3. Uploaded more than 5 minutes ago
    if (doc.ai_processed || doc.control_links.length > 0) return false

    const uploadTime = new Date(doc.created_at).getTime()
    const now = new Date().getTime()
    const minutesSinceUpload = (now - uploadTime) / (1000 * 60)

    return minutesSinceUpload > 5
  }

  const getProcessingDuration = (doc: Document) => {
    const uploadTime = new Date(doc.created_at).getTime()
    const now = new Date().getTime()
    const minutes = Math.floor((now - uploadTime) / (1000 * 60))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  const retryProcessing = async (doc: Document) => {
    try {
      // Trigger a new processing attempt by calling the analyze endpoint
      const response = await authFetch('/api/analyze-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_ids: [doc.id]
        })
      })

      if (response.ok) {
        alert(`Retry initiated for ${doc.filename}. Processing may take a few minutes.`)
        // Refresh documents after a short delay
        setTimeout(() => fetchDocuments(), 2000)
      } else {
        throw new Error('Failed to retry processing')
      }
    } catch (error) {
      console.error('Failed to retry processing:', error)
      alert('Failed to retry processing. You can try linking manually instead.')
    }
  }

  const openLinkModal = async (doc: Document) => {
    setSelectedDocument(doc)
    setShowLinkModal(true)

    // Fetch frameworks if not already loaded
    if (frameworks.length === 0) {
      try {
        const response = await authFetch('/api/frameworks')
        if (response.ok) {
          const data = await response.json()
          setFrameworks(data.frameworks)
          if (data.frameworks.length > 0) {
            setSelectedFramework(data.frameworks[0].id)
            fetchControls(data.frameworks[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch frameworks:', error)
      }
    } else if (selectedFramework) {
      fetchControls(selectedFramework)
    }
  }

  const fetchControls = async (frameworkId: string) => {
    try {
      const response = await authFetch(`/api/frameworks/${frameworkId}/controls`)
      if (response.ok) {
        const data = await response.json()
        setControls(data.controls)
      }
    } catch (error) {
      console.error('Failed to fetch controls:', error)
    }
  }

  const handleFrameworkChange = (frameworkId: string) => {
    setSelectedFramework(frameworkId)
    setSelectedControls([])
    fetchControls(frameworkId)
  }

  const toggleControlSelection = (controlId: string) => {
    setSelectedControls(prev =>
      prev.includes(controlId)
        ? prev.filter(id => id !== controlId)
        : [...prev, controlId]
    )
  }

  const linkSelectedControls = async () => {
    if (!selectedDocument || selectedControls.length === 0) return

    try {
      // Link each selected control to the document via the API
      for (const controlId of selectedControls) {
        const response = await authFetch(`/api/documents/${selectedDocument.id}/link-evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            control_id: controlId,
            requirement_id: null,
            note: 'Manually linked'
          })
        })

        if (!response.ok) {
          const error = await response.json()
          // Skip if already linked
          if (!error.detail?.includes('already exists')) {
            throw new Error(error.detail || 'Failed to link control')
          }
        }
      }

      // Refresh documents
      await fetchDocuments()

      // Close modal
      setShowLinkModal(false)
      setSelectedDocument(null)
      setSelectedControls([])

      alert(`Successfully linked ${selectedControls.length} control(s) to ${selectedDocument.filename}`)
    } catch (error) {
      console.error('Failed to link controls:', error)
      alert(`Failed to link controls: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading documents...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="text-4xl mb-4">📄</div>
        <p>No documents uploaded yet</p>
        <p className="text-sm mt-2">Upload your first document to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-900">Uploaded Documents</h2>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow w-full overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className="text-2xl flex-shrink-0">{getFileIcon(doc.mime_type)}</div>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {doc.filename}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Size: {formatFileSize(doc.file_size)}</p>
                    <p>Uploaded: {formatDate(doc.created_at)}</p>
                    <p>Type: {doc.mime_type}</p>
                    
                    {/* AI Processing Status */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {doc.ai_processed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🧠 AI Analyzed
                          </span>
                        ) : isProcessingFailed(doc) ? (
                          <>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ❌ Failed ({getProcessingDuration(doc)})
                            </span>
                            <button
                              onClick={() => retryProcessing(doc)}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-600 text-white hover:bg-orange-700"
                              title="Retry AI processing (useful for OCR failures)"
                            >
                              🔄 Retry
                            </button>
                            <button
                              onClick={() => openLinkModal(doc)}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                              title="Manually select controls to link"
                            >
                              🔗 Link Manually
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              ⏳ Processing ({getProcessingDuration(doc)})
                            </span>
                            <button
                              onClick={() => fetchDocuments()}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-orange-700 hover:text-orange-900 hover:bg-orange-50"
                              title="Refresh status"
                            >
                              ↻
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* AI Analysis Completion Control */}
                      {doc.ai_processed && (
                        <div className="flex items-center space-x-1">
                          {doc.control_links.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-green-700 font-medium">
                                {doc.control_links.length} control{doc.control_links.length > 1 ? 's' : ''} found
                              </span>
                              <button
                                onClick={() => {
                                  const summary = doc.control_links.map(link => 
                                    `• ${link.control_code}: ${link.control_title} (${Math.round(link.confidence * 100)}% confidence)`
                                  ).join('\n')
                                  alert(`AI Analysis Results for "${doc.filename}":\n\n${summary}\n\nClick on individual controls below to see detailed reasoning.`)
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                                title="View AI analysis summary"
                              >
                                View Summary
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-600">No controls matched</span>
                              <button
                                onClick={() => {
                                  alert(`AI Analysis Complete for "${doc.filename}":\n\nNo compliance controls were automatically matched to this document.\n\nThis could mean:\n• The document doesn't contain compliance-related content\n• The content doesn't match Essential Eight controls\n• Manual review may be needed\n\nYou can manually link controls using the Controls page.`)
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                                title="Why no controls were found"
                              >
                                Why?
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Control Links from AI */}
                    {doc.control_links.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1">🤖 AI-Linked Controls:</p>
                        <div className="space-y-1 max-w-full">
                          {doc.control_links.map((link, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                alert(`Control Mapping Details:\n\nControl: ${link.control_code}\nTitle: ${link.control_title}\nConfidence: ${Math.round(link.confidence * 100)}%\n\nAI Reasoning:\n${link.reasoning || 'No detailed reasoning provided.'}`)
                              }}
                              className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 rounded px-2 py-1 min-w-0 transition-colors"
                              title="Click to see AI reasoning"
                            >
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <span className="text-xs font-medium text-green-800 flex-shrink-0">
                                  {link.control_code}
                                </span>
                                <span className="text-xs text-green-600 truncate flex-1 min-w-0" title={link.control_title}>
                                  {link.control_title}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  link.confidence >= 0.8 ? 'bg-green-500' :
                                  link.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                                }`} title={`Confidence: ${Math.round(link.confidence * 100)}%`}></div>
                              </div>
                              <span className="text-xs text-green-700 flex-shrink-0 ml-2">
                                {Math.round(link.confidence * 100)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Manual Control Mappings (legacy) */}
                    {getDocumentMappings(doc.id).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1">📎 Manual Links:</p>
                        <div className="space-y-1 max-w-full">
                          {getDocumentMappings(doc.id).map((mapping, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-blue-50 rounded px-2 py-1 min-w-0">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <span className="text-xs font-medium text-blue-800 flex-shrink-0">
                                  {mapping.control_code}
                                </span>
                                <span className="text-xs text-blue-600 truncate flex-1 min-w-0" title={mapping.framework_name}>
                                  {mapping.framework_name}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  mapping.confidence >= 0.8 ? 'bg-green-500' :
                                  mapping.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                                }`}></div>
                              </div>
                              <button
                                onClick={() => removeMapping(doc.id, mapping.control_code)}
                                className="text-xs text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                                title="Remove mapping"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 flex-shrink-0">
                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                  <a
                    href={doc.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
                  >
                    Download
                  </a>
                  
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="inline-flex items-center justify-center px-3 py-1 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
                
                {/* Control Mapping Summary */}
                {getDocumentMappings(doc.id).length > 0 && (
                  <div className="text-xs text-gray-500 text-center sm:text-left">
                    🔗 {getDocumentMappings(doc.id).length} control{getDocumentMappings(doc.id).length > 1 ? 's' : ''} mapped
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Linking Modal */}
      {showLinkModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Link Controls to {selectedDocument.filename}
                </h3>
                <button
                  onClick={() => {
                    setShowLinkModal(false)
                    setSelectedDocument(null)
                    setSelectedControls([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Select the controls that this document provides evidence for.
              </p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {/* Framework Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Framework
                </label>
                <select
                  value={selectedFramework}
                  onChange={(e) => handleFrameworkChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {frameworks.map((fw) => (
                    <option key={fw.id} value={fw.id}>
                      {fw.name} {fw.version ? `(${fw.version})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Controls List */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Controls ({selectedControls.length} selected)
                </label>
                {controls.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading controls...</p>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-1">
                    {controls.map((control) => (
                      <label
                        key={control.id}
                        className="flex items-start p-3 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedControls.includes(control.id)}
                          onChange={() => toggleControlSelection(control.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {control.code}
                          </div>
                          <div className="text-xs text-gray-600">
                            {control.title}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowLinkModal(false)
                  setSelectedDocument(null)
                  setSelectedControls([])
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={linkSelectedControls}
                disabled={selectedControls.length === 0}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white ${
                  selectedControls.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Link {selectedControls.length} Control{selectedControls.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}