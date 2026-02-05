import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, ExternalLink, Database, Upload, Shield } from 'lucide-react';

const FirebaseSetup: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const envContent = `VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef`;

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">Firebase Setup Required</h1>
                <p className="opacity-90">Complete these steps to enable real-time sync across all devices</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Why Firebase */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Why do you need Firebase?</h3>
              <p className="text-blue-700 text-sm">
                Firebase provides a cloud database and file storage. Without it, data only exists on your local computer. 
                With Firebase, all students can access photos/videos from any device, anywhere in the world, in real-time!
              </p>
            </div>

            {/* Step 1 */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                <h3 className="text-lg font-semibold">Create a Firebase Project</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-11">
                <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a></li>
                <li>Click <strong>"Create a project"</strong> or <strong>"Add project"</strong></li>
                <li>Enter a project name (e.g., "class-x-media")</li>
                <li>Disable Google Analytics (not needed) and click <strong>Create</strong></li>
                <li>Wait for the project to be created</li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
                <h3 className="text-lg font-semibold">Add a Web App</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-11">
                <li>In your Firebase project, click the <strong>web icon (&lt;/&gt;)</strong> to add a web app</li>
                <li>Enter an app nickname (e.g., "Class X Portal")</li>
                <li>Click <strong>Register app</strong></li>
                <li>You'll see your Firebase config - <strong>copy these values</strong></li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">3</div>
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">Enable Firestore Database</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-11">
                <li>In Firebase Console, go to <strong>Build → Firestore Database</strong></li>
                <li>Click <strong>"Create database"</strong></li>
                <li>Select <strong>"Start in test mode"</strong></li>
                <li>Choose a location closest to your users</li>
                <li>Click <strong>Enable</strong></li>
                <li>Go to <strong>Rules</strong> tab and paste:</li>
              </ol>
              <div className="ml-11 mt-3 relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{firestoreRules}</pre>
                <button
                  onClick={() => copyToClipboard(firestoreRules, 3)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  {copiedStep === 3 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
              <p className="ml-11 mt-2 text-sm text-gray-500">Click <strong>Publish</strong> after pasting the rules</p>
            </div>

            {/* Step 4 */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">4</div>
                <Upload className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">Enable Storage</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-11">
                <li>In Firebase Console, go to <strong>Build → Storage</strong></li>
                <li>Click <strong>"Get started"</strong></li>
                <li>Select <strong>"Start in test mode"</strong></li>
                <li>Click <strong>Next</strong> and then <strong>Done</strong></li>
                <li>Go to <strong>Rules</strong> tab and paste:</li>
              </ol>
              <div className="ml-11 mt-3 relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{storageRules}</pre>
                <button
                  onClick={() => copyToClipboard(storageRules, 4)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  {copiedStep === 4 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
              <p className="ml-11 mt-2 text-sm text-gray-500">Click <strong>Publish</strong> after pasting the rules</p>
            </div>

            {/* Step 5 */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">5</div>
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">Add Environment Variables</h3>
              </div>
              <p className="text-gray-700 ml-11 mb-3">
                Create a file named <code className="bg-gray-100 px-2 py-1 rounded">.env</code> in your project root with your Firebase config:
              </p>
              <div className="ml-11 relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{envContent}</pre>
                <button
                  onClick={() => copyToClipboard(envContent, 5)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  {copiedStep === 5 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
              <div className="ml-11 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Replace</strong> the placeholder values with your actual Firebase config values from Step 2!
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="border rounded-xl p-5 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">6</div>
                <h3 className="text-lg font-semibold text-green-800">Restart & Deploy</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-green-700 ml-11">
                <li>Save the <code className="bg-green-100 px-2 py-1 rounded">.env</code> file</li>
                <li>Restart your development server</li>
                <li>Deploy to a hosting service (Vercel, Netlify, Firebase Hosting)</li>
                <li>Share the URL with your students!</li>
              </ol>
            </div>

            {/* Help */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">
                Need help? Check the{' '}
                <a 
                  href="https://firebase.google.com/docs/web/setup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Firebase Documentation
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
