'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Framework {
  id: string;
  name: string;
  version: string;
  description: string;
  created_at: string;
}

interface Control {
  id: string;
  code: string;
  title: string;
  description: string;
  requirements_count: number;
  linked_documents_count: number;
  created_at: string;
}

interface LinkedDocument {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  download_url: string;
  confidence: number;
  reasoning: string;
  link_created_at: string;
}

function LinkedDocuments({ controlId }: { controlId: string }) {
  const [documents, setDocuments] = useState<LinkedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/controls/${controlId}/documents`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents);
        }
      } catch (error) {
        console.error('Failed to fetch linked documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [controlId]);

  if (loading) {
    return <div className="text-xs text-gray-500">Loading...</div>;
  }

  if (documents.length === 0) {
    return <div className="text-xs text-gray-500">No documents linked</div>;
  }

  return (
    <div className="space-y-1">
      {documents.slice(0, 2).map((doc) => (
        <div key={doc.id} className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 flex-1 min-w-0">
            <span className="text-green-700 truncate" title={doc.filename}>
              📄 {doc.filename.split('/').pop()}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${
              doc.confidence >= 0.8 ? 'bg-green-500' :
              doc.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
            }`} title={`Confidence: ${Math.round(doc.confidence * 100)}%`}></div>
          </div>
          <a
            href={doc.download_url}
            className="text-green-600 hover:text-green-800 ml-1"
            title="Download"
          >
            ⬇
          </a>
        </div>
      ))}
      {documents.length > 2 && (
        <div className="text-xs text-green-600">
          +{documents.length - 2} more document{documents.length - 2 !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default function ControlsPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      const response = await fetch('/api/frameworks');
      if (response.ok) {
        const data = await response.json();
        setFrameworks(data.frameworks);
        if (data.frameworks.length > 0) {
          setSelectedFramework(data.frameworks[0].id);
          fetchControls(data.frameworks[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch frameworks:', error);
    }
  };

  const fetchControls = async (frameworkId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/frameworks/${frameworkId}/controls`);
      if (response.ok) {
        const data = await response.json();
        setControls(data.controls);
      }
    } catch (error) {
      console.error('Failed to fetch controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFrameworkChange = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    fetchControls(frameworkId);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compliance Controls</h1>
          <p className="text-gray-600">
            Browse and manage compliance controls across different frameworks.
          </p>
        </div>

        {/* Framework Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Framework
          </label>
          <select
            value={selectedFramework}
            onChange={(e) => handleFrameworkChange(e.target.value)}
            className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {frameworks.map((framework) => (
              <option key={framework.id} value={framework.id}>
                {framework.name} {framework.version}
              </option>
            ))}
          </select>
        </div>

        {/* Controls Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading controls...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {controls.map((control) => (
              <div
                key={control.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {control.code}
                      </h3>
                      <h4 className="text-md font-medium text-blue-600 mt-1">
                        {control.title}
                      </h4>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full text-center">
                        {control.requirements_count} reqs
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full text-center ${
                        control.linked_documents_count > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {control.linked_documents_count > 0 
                          ? `🧠 ${control.linked_documents_count} doc${control.linked_documents_count !== 1 ? 's' : ''}`
                          : '📄 No docs'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {control.description}
                  </p>
                  
                  {/* Show linked documents if any */}
                  {control.linked_documents_count > 0 && (
                    <div className="mb-4 p-2 bg-green-50 rounded border">
                      <div className="text-xs font-medium text-green-800 mb-1">
                        🤖 AI-Linked Evidence:
                      </div>
                      <LinkedDocuments controlId={control.id} />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/controls/${control.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                    <span className="text-xs text-gray-500">
                      {new Date(control.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && controls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No controls available</h3>
              <p className="text-gray-600">
                No compliance controls found for the selected framework.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}