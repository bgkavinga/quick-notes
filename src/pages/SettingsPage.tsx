import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Settings } from '@/context/NoteContext';
import useNotificationManager from '@/hooks/useNotificationManager';
import useConfigManager from '@/hooks/useConfigManager';

const SettingsPage = () => {
    const notificationManager = useNotificationManager()
    const [settings, setSettings] = useState<Settings>({
        persistState: false
    })
    const { getAllConfig, setConfig } = useConfigManager()

    useEffect(() => {
        (async () => {
            setSettings(await getAllConfig())
        })()
    }, []);

    const saveSettings = async () => {
        await setConfig(settings)
        notificationManager.setNotification('Settings saved successfully!')
    };

    return (
        <>
            <main className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 w-40">Persist State</label>
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={settings.persistState}
                            onChange={(e) => setSettings({
                                ...settings,
                                persistState: e.target.checked
                            })}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">

                    <button onClick={saveSettings} >
                        Save Settings
                    </button>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default SettingsPage;
