import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GeekyGoose Compliance
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Compliance automation platform for SMB + internal IT teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/documents" className="group">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📁</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Document Management
              </h2>
              <p className="text-gray-600">
                Upload, organize, and manage your compliance documents
              </p>
            </div>
          </Link>

          <Link href="/controls" className="group">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Controls Library
              </h2>
              <p className="text-gray-600">
                Browse compliance frameworks and requirements
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Essential Eight Framework
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Available Controls:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-Factor Authentication (MFA)</li>
                <li>• Application Control</li>
                <li>• Patch Applications</li>
                <li>• Patch Operating Systems</li>
                <li>• Restrict Administrative Privileges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automated evidence scanning</li>
                <li>• Gap analysis and recommendations</li>
                <li>• Compliance reporting</li>
                <li>• Audit trail tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}