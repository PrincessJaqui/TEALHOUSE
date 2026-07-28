import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { DeploymentGuide } from './DeploymentGuide';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1960f17`;

export function SupabaseConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [result, setResult] = useState<{
    health: boolean | null;
    customers: boolean | null;
    error?: string;
  }>({
    health: null,
    customers: null
  });

  const testConnection = async () => {
    setTesting(true);
    setResult({ health: null, customers: null });

    try {
      // Test 1: Health check
      console.log('Testing health endpoint:', `${API_BASE_URL}/health`);
      const healthResponse = await fetch(`${API_BASE_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const healthOk = healthResponse.ok;
      console.log('Health check result:', healthOk, await healthResponse.text());

      // Test 2: Customers endpoint
      console.log('Testing customers endpoint:', `${API_BASE_URL}/customers`);
      const customersResponse = await fetch(`${API_BASE_URL}/customers`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const customersOk = customersResponse.ok;
      const customersData = await customersResponse.json();
      console.log('Customers check result:', customersOk, customersData);

      setResult({
        health: healthOk,
        customers: customersOk,
        error: customersOk ? undefined : customersData.error
      });
    } catch (error: any) {
      console.error('Connection test error:', error);
      setResult({
        health: false,
        customers: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Backend Connection Test</CardTitle>
        <CardDescription>
          Test the connection to your Supabase Edge Functions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            {result.health === null ? (
              <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
            ) : result.health ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="font-medium">Health Endpoint</p>
              <p className="text-sm text-neutral-600">{API_BASE_URL}/health</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border rounded-lg">
            {result.customers === null ? (
              <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
            ) : result.customers ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <p className="font-medium">Customer Management API</p>
              <p className="text-sm text-neutral-600">{API_BASE_URL}/customers</p>
            </div>
          </div>
        </div>

        {result.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {result.error}
            </p>
          </div>
        )}

        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>

        {result.health === false || result.customers === false ? (
          <>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-900 mb-2">⚠️ Edge Function Not Deployed</p>
              <p className="text-yellow-800 mb-4">
                The Supabase Edge Function needs to be deployed to enable customer management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <a
                  href="/EASY_DEPLOYMENT_NO_TERMINAL.md"
                  target="_blank"
                  className="flex items-center justify-center gap-2 p-3 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition-colors"
                >
                  <span>🌐 Easy Guide (No Terminal)</span>
                </a>
                <a
                  href="/HOW_TO_OPEN_TERMINAL.md"
                  target="_blank"
                  className="flex items-center justify-center gap-2 p-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <span>💻 Terminal Guide</span>
                </a>
              </div>

              <Button
                onClick={() => setShowGuide(!showGuide)}
                variant="outline"
                className="w-full"
              >
                {showGuide ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Detailed Instructions
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show Detailed Instructions
                  </>
                )}
              </Button>
            </div>
            
            {showGuide && (
              <div className="mt-4">
                <DeploymentGuide />
              </div>
            )}
          </>
        ) : result.health && result.customers ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ <strong>All connections successful!</strong> Your Supabase backend is properly configured and deployed.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}