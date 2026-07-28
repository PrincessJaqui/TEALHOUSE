import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Circle, ExternalLink, FileText } from 'lucide-react';
import { Button } from './ui/button';

export function DeploymentChecklist() {
  return (
    <Card className="bg-gradient-to-br from-[#008080]/5 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚀</span> Quick Deployment Checklist
        </CardTitle>
        <CardDescription>
          Follow these steps to get your customer management system online
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <Circle className="w-5 h-5 text-[#008080]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Step 1: Choose Your Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/EASY_DEPLOYMENT_NO_TERMINAL.md"
                target="_blank"
                className="flex items-center gap-2 p-3 border border-[#008080] bg-[#008080]/5 rounded-lg hover:bg-[#008080]/10 transition-colors group"
              >
                <FileText className="w-5 h-5 text-[#008080]" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Browser Only</p>
                  <p className="text-xs text-neutral-600">Easiest method</p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#008080]" />
              </a>
              
              <a
                href="/HOW_TO_OPEN_TERMINAL.md"
                target="_blank"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-neutral-50 transition-colors group"
              >
                <FileText className="w-5 h-5 text-neutral-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Terminal</p>
                  <p className="text-xs text-neutral-600">For advanced users</p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <Circle className="w-5 h-5 text-[#008080]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Step 2: Get Service Role Key</h3>
            <p className="text-sm text-neutral-600 mb-3">
              You'll need this secret key from your Supabase dashboard
            </p>
            <a
              href="https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/settings/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <span>Open API Settings</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <Circle className="w-5 h-5 text-[#008080]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Step 3: Deploy Function</h3>
            <p className="text-sm text-neutral-600">
              Follow the guide to create and deploy the "server" edge function
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <Circle className="w-5 h-5 text-[#008080]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Step 4: Test Connection</h3>
            <p className="text-sm text-neutral-600 mb-3">
              Use the "Test Connection" button above to verify everything works
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-600">Expected result:</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 font-medium">All green checkmarks</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">📚 Need More Help?</h3>
          <div className="space-y-2">
            <a
              href="/START_HERE.md"
              target="_blank"
              className="flex items-center gap-2 text-sm text-[#008080] hover:underline"
            >
              <FileText className="w-4 h-4" />
              Complete Getting Started Guide
            </a>
            <a
              href="https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/functions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#008080] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View Functions in Dashboard
            </a>
            <a
              href="https://supabase.com/docs/guides/functions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#008080] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Supabase Edge Functions Documentation
            </a>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Pro Tip:</strong> If you're new to deployment, we recommend the 
            <a href="/EASY_DEPLOYMENT_NO_TERMINAL.md" target="_blank" className="underline mx-1 hover:no-underline">
              Browser-Only method
            </a>
            - it's much simpler and doesn't require any terminal commands!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
