import ControlClient from './components/client'
import { DockNavigation } from '../components/dock';
import { createClient } from '@veap/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function VertagriControlPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return redirect('/dashboard'); 
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const userRole = profile?.role || 'guest';

    return (
        <div>
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800">Vertagri Settings</h1>
            <ControlClient />
            <DockNavigation  role={userRole} />
        </div>
    );
}
