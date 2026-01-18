'use client';

import { useState } from 'react';

export default function DatabaseTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Testing...' : 'Test Database Connection'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
          <h3 className="font-semibold mb-2">
            {result.success ? '✅ Success!' : '❌ Failed'}
          </h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <h3 className="font-semibold text-red-700 mb-2">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Make sure PostgreSQL is running</li>
          <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file with your database credentials</li>
          <li>Click the button above to test the connection</li>
          <li>Check <code className="bg-gray-200 px-1 rounded">DATABASE_SETUP.md</code> for detailed instructions</li>
        </ol>
      </div>
    </div>
  );
}

