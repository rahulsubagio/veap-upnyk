// src/app/dashboard/(protected)/hidroponik/control/page.tsx
import ControlClient from './components/client'

export default function HidroponikControlPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">System Control & Automation</h1>
                <p className="mt-1 text-gray-600">
                    Switch between automatic and manual modes, and set your automation parameters.
                </p>
            </div>
            
            <ControlClient />
        </div>
    );
}
