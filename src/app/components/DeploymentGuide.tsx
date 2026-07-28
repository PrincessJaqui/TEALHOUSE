import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Terminal, Key, Rocket, ExternalLink } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function DeploymentGuide() {
  const steps = [
    {
      number: 1,
      title: 'Install Supabase CLI',
      icon: Terminal,
      commands: ['npm install -g supabase'],
      description: 'Install the Supabase CLI globally on your computer'
    },
    {
      number: 2,
      title: 'Login to Supabase',
      icon: Key,
      commands: ['supabase login'],
      description: 'Authenticate with your Supabase account (opens browser)'
    },
    {
      number: 3,
      title: 'Link Your Project',
      icon: CheckCircle,
      commands: [`supabase link --project-ref ${projectId}`],
      description: 'Connect your local files to your Supabase project'
    },
    {
      number: 4,
      title: 'Set Secrets',
      icon: Key,
      commands: [
        `supabase secrets set SUPABASE_URL=https://${projectId}.supabase.co`,
        'supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-key-here>'
      ],
      description: 'Configure environment variables',
      link: {
        text: 'Get your Service Role Key',
        url: `https://supabase.com/dashboard/project/${projectId}/settings/api`
      }
    },
    {
      number: 5,
      title: 'Deploy Function',
      icon: Rocket,
      commands: ['supabase functions deploy server'],
      description: 'Deploy your edge function to Supabase'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Instructions</CardTitle>
        <CardDescription>
          Follow these steps to deploy your customer management backend to Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-px bg-neutral-200" />
              )}
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#008080] text-white flex items-center justify-center relative z-10">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 pb-8">
                  <h3 className="font-medium mb-1">
                    Step {step.number}: {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    {step.description}
                  </p>
                  
                  <div className="space-y-2">
                    {step.commands.map((command, cmdIndex) => (
                      <div 
                        key={cmdIndex}
                        className="bg-neutral-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto"
                      >
                        <code>{command}</code>
                      </div>
                    ))}
                  </div>

                  {step.link && (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm text-[#008080] hover:underline"
                    >
                      {step.link.text}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">🎯 Quick Deploy Scripts</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Or use our automated deployment scripts:
          </p>
          <div className="space-y-2">
            <div className="bg-neutral-900 text-green-400 p-3 rounded font-mono text-sm">
              <code># Mac/Linux</code><br />
              <code>chmod +x deploy.sh && ./deploy.sh</code>
            </div>
            <div className="bg-neutral-900 text-green-400 p-3 rounded font-mono text-sm">
              <code># Windows</code><br />
              <code>deploy.bat</code>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mt-3">
            These scripts are in your project root folder (deploy.sh for Mac/Linux or deploy.bat for Windows).
            They will automatically guide you through the entire deployment process.
          </p>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">📚 Additional Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/SUPABASE_DEPLOYMENT.md"
                className="text-[#008080] hover:underline inline-flex items-center gap-1"
              >
                Full Deployment Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://supabase.com/docs/guides/functions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#008080] hover:underline inline-flex items-center gap-1"
              >
                Supabase Edge Functions Docs
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href={`https://supabase.com/dashboard/project/${projectId}/functions`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#008080] hover:underline inline-flex items-center gap-1"
              >
                View Functions in Dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}