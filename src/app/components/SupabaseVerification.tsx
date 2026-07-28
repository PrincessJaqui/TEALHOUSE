import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type TestStatus = 'pending' | 'success' | 'error' | 'testing';

interface TestResult {
  name: string;
  status: TestStatus;
  message?: string;
  details?: string;
}

export function SupabaseVerification() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [autoTested, setAutoTested] = useState(false);

  // Auto-run test on mount
  useEffect(() => {
    if (!autoTested) {
      runTests();
      setAutoTested(true);
    }
  }, [autoTested]);

  const runTests = async () => {
    setTesting(true);
    const testResults: TestResult[] = [];

    // Test 1: Verify API Key Format
    testResults.push({
      name: '1. API Key Format',
      status: 'testing',
      message: 'Checking publishable key format...'
    });
    setResults([...testResults]);

    const keyValid = publicAnonKey.startsWith('sb_publishable_');
    testResults[testResults.length - 1] = {
      name: '1. API Key Format',
      status: keyValid ? 'success' : 'error',
      message: keyValid 
        ? 'Using new publishable key format ✓' 
        : 'Old JWT format detected - needs update',
      details: keyValid ? `Key: ${publicAnonKey.substring(0, 30)}...` : 'Please update to sb_publishable_... format'
    };
    setResults([...testResults]);

    // Test 2: Connection to Supabase
    testResults.push({
      name: '2. Supabase Connection',
      status: 'testing',
      message: 'Testing connection to Supabase...'
    });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase.from('products').select('count');
      
      if (error) {
        testResults[testResults.length - 1] = {
          name: '2. Supabase Connection',
          status: 'error',
          message: 'Connection failed',
          details: error.message
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '2. Supabase Connection',
          status: 'success',
          message: 'Connected to Supabase successfully ✓',
          details: `Project ID: ${projectId}`
        };
      }
    } catch (err: any) {
      testResults[testResults.length - 1] = {
        name: '2. Supabase Connection',
        status: 'error',
        message: 'Connection error',
        details: err.message
      };
    }
    setResults([...testResults]);

    // Test 3: Products Table
    testResults.push({
      name: '3. Products Table',
      status: 'testing',
      message: 'Checking products table...'
    });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      if (error) {
        testResults[testResults.length - 1] = {
          name: '3. Products Table',
          status: 'error',
          message: 'Table not accessible',
          details: error.message.includes('relation "public.products" does not exist') 
            ? 'Products table not created. Run supabase-schema.sql'
            : error.message
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '3. Products Table',
          status: 'success',
          message: data && data.length > 0 
            ? `Products table exists with data ✓` 
            : 'Products table exists (empty)',
          details: data && data.length > 0 
            ? `Found ${data.length} sample product(s)` 
            : 'Ready to add products'
        };
      }
    } catch (err: any) {
      testResults[testResults.length - 1] = {
        name: '3. Products Table',
        status: 'error',
        message: 'Table check failed',
        details: err.message
      };
    }
    setResults([...testResults]);

    // Test 4: Anonymous Auth
    testResults.push({
      name: '4. Anonymous Authentication',
      status: 'testing',
      message: 'Testing anonymous sign-in...'
    });
    setResults([...testResults]);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        testResults[testResults.length - 1] = {
          name: '4. Anonymous Authentication',
          status: 'success',
          message: 'User session active ✓',
          details: `User ID: ${sessionData.session.user.id.substring(0, 16)}...`
        };
      } else {
        // Try to create anonymous session
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        
        if (anonError) {
          testResults[testResults.length - 1] = {
            name: '4. Anonymous Authentication',
            status: 'error',
            message: 'Anonymous auth disabled',
            details: 'Enable Anonymous sign-ins in Supabase Dashboard → Authentication → Providers'
          };
        } else {
          testResults[testResults.length - 1] = {
            name: '4. Anonymous Authentication',
            status: 'success',
            message: 'Anonymous sign-in successful ✓',
            details: `User ID: ${anonData.user?.id.substring(0, 16)}...`
          };
        }
      }
    } catch (err: any) {
      testResults[testResults.length - 1] = {
        name: '4. Anonymous Authentication',
        status: 'error',
        message: 'Auth test failed',
        details: err.message
      };
    }
    setResults([...testResults]);

    // Test 5: Cart Table
    testResults.push({
      name: '5. Cart Table',
      status: 'testing',
      message: 'Checking cart table...'
    });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .limit(1);

      if (error) {
        testResults[testResults.length - 1] = {
          name: '5. Cart Table',
          status: 'error',
          message: 'Cart table not accessible',
          details: error.message.includes('relation "public.cart" does not exist')
            ? 'Cart table not created. Run supabase-schema.sql'
            : error.message
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '5. Cart Table',
          status: 'success',
          message: 'Cart table ready ✓',
          details: 'Cart persistence enabled'
        };
      }
    } catch (err: any) {
      testResults[testResults.length - 1] = {
        name: '5. Cart Table',
        status: 'error',
        message: 'Cart check failed',
        details: err.message
      };
    }
    setResults([...testResults]);

    // Test 6: Wishlist Table
    testResults.push({
      name: '6. Wishlist Table',
      status: 'testing',
      message: 'Checking wishlist table...'
    });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .limit(1);

      if (error) {
        testResults[testResults.length - 1] = {
          name: '6. Wishlist Table',
          status: 'error',
          message: 'Wishlist table not accessible',
          details: error.message.includes('relation "public.wishlist" does not exist')
            ? 'Wishlist table not created. Run supabase-schema.sql'
            : error.message
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '6. Wishlist Table',
          status: 'success',
          message: 'Wishlist table ready ✓',
          details: 'Wishlist persistence enabled'
        };
      }
    } catch (err: any) {
      testResults[testResults.length - 1] = {
        name: '6. Wishlist Table',
        status: 'error',
        message: 'Wishlist check failed',
        details: err.message
      };
    }
    setResults([...testResults]);

    setTesting(false);
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'testing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const allPassed = results.length > 0 && results.every(r => r.status === 'success');
  const anyErrors = results.some(r => r.status === 'error');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🔌 Supabase Connection Verification</CardTitle>
          <CardDescription>
            Testing your TEALHOUSE Supabase integration with the new publishable API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Info */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Project ID:</span>
              <code className="text-xs bg-white px-2 py-1 rounded">{projectId}</code>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">API Key:</span>
              <code className="text-xs bg-white px-2 py-1 rounded">
                {publicAnonKey.substring(0, 30)}...
              </code>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Supabase URL:</span>
              <code className="text-xs bg-white px-2 py-1 rounded">
                https://{projectId}.supabase.co
              </code>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 border rounded-lg transition-all"
              >
                <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{result.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-50 p-2 rounded">
                      {result.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button
            onClick={runTests}
            disabled={testing}
            className="w-full bg-[#008080] hover:bg-[#006666]"
            size="lg"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-run Tests
              </>
            )}
          </Button>

          {/* Overall Status */}
          {results.length > 0 && !testing && (
            <div
              className={`p-4 rounded-lg border-2 ${
                allPassed
                  ? 'bg-green-50 border-green-200'
                  : anyErrors
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              {allPassed ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 text-lg">
                      ✅ All Tests Passed!
                    </h3>
                    <p className="text-green-800 mt-1">
                      Your Supabase connection is working perfectly. The new publishable API key is active and all database tables are accessible.
                    </p>
                  </div>
                </div>
              ) : anyErrors ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 text-lg">
                      ⚠️ Setup Required
                    </h3>
                    <p className="text-red-800 mt-1 mb-3">
                      Some tests failed. Follow these steps to complete your setup:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-red-800 text-sm">
                      {results.find(r => r.name.includes('Products Table') && r.status === 'error') && (
                        <li>
                          Run the database schema: Open <a href="/lib/supabase-schema.sql" className="underline font-medium">supabase-schema.sql</a> in your Supabase SQL Editor
                        </li>
                      )}
                      {results.find(r => r.name.includes('Anonymous Auth') && r.status === 'error') && (
                        <li>
                          Enable Anonymous sign-ins in Supabase Dashboard → Authentication → Providers
                        </li>
                      )}
                      {results.find(r => r.name.includes('Connection') && r.status === 'error') && (
                        <li>
                          Verify your API key is correct in the Supabase Dashboard → Settings → API
                        </li>
                      )}
                    </ol>
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <p className="text-sm text-red-700">
                        📖 <strong>Need help?</strong> Check <a href="/SUPABASE_SETUP.md" className="underline font-medium">SUPABASE_SETUP.md</a> for detailed instructions
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Loader2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 animate-spin" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 text-lg">Testing...</h3>
                    <p className="text-yellow-800 mt-1">
                      Running connection tests. This will take a few seconds.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            <a
              href={`https://app.supabase.com/project/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#008080] hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              🎛️ Supabase Dashboard
            </a>
            <a
              href={`https://app.supabase.com/project/${projectId}/editor`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#008080] hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              📊 Table Editor
            </a>
            <a
              href={`https://app.supabase.com/project/${projectId}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-[#008080] hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              💻 SQL Editor
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions Card */}
      {anyErrors && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Next Steps to Complete Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Run Database Schema</h4>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>Open <a href={`https://app.supabase.com/project/${projectId}/sql/new`} target="_blank" rel="noopener noreferrer" className="text-[#008080] underline">Supabase SQL Editor</a></li>
                  <li>Copy the contents of <code className="bg-gray-100 px-1 rounded">/lib/supabase-schema.sql</code></li>
                  <li>Paste and click <strong>Run</strong></li>
                  <li>This creates: products, cart, wishlist, and orders tables</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Enable Anonymous Authentication</h4>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>Go to <a href={`https://app.supabase.com/project/${projectId}/auth/providers`} target="_blank" rel="noopener noreferrer" className="text-[#008080] underline">Authentication → Providers</a></li>
                  <li>Scroll to <strong>Anonymous sign-ins</strong></li>
                  <li>Toggle it <strong>ON</strong> ✅</li>
                  <li>Click <strong>Save</strong></li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Add Sample Products (Optional)</h4>
                <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                  <li>Copy the contents of <code className="bg-gray-100 px-1 rounded">/lib/seed-products-final.sql</code></li>
                  <li>Run in SQL Editor to add 4 sample products</li>
                </ol>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  After completing these steps, click <strong>"Re-run Tests"</strong> above to verify everything is working.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
