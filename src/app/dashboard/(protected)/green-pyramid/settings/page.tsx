import ControlClient from './components/client'
import { DockNavigation } from '../components/dock';

export default function HidroponikControlPage() {
    return (
        <div>
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800">Green Pyramid Settings</h1>
            <ControlClient />
            <DockNavigation />
        </div>
    );
}
