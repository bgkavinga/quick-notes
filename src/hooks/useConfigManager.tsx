import { useState } from "react"
import useStorageManager from "./useStorageManager"
import { Settings } from "@/context/NoteContext"

export const CONFIG_PERSIST_STATE = 'persistState'

const useConfigManager = () => {
    const { getItem, setItem, CONFIG_KEY } = useStorageManager()
    const [isLoaded, setIsLoaded] = useState(false)
    const [allConfig, setAllConfig] = useState<Settings>({
        persistState: false
    })
    const getConfig = async (key: keyof Settings): Promise<Settings[keyof Settings] | null> => {
        const savedConfig = await getAllConfig()
        return savedConfig[key] ?? null;
    };

    const setConfig = async (config: Settings) => {
        setAllConfig(config)
        await setItem(CONFIG_KEY, config)
    }

    const getAllConfig = async () => {
        let savedConfig = allConfig
        if (!isLoaded) {
            savedConfig = await getItem(CONFIG_KEY)
            setAllConfig(savedConfig)
            setIsLoaded(true)
        }
        return savedConfig
    }


    return {
        getConfig,
        setConfig,
        getAllConfig
    }
}

export default useConfigManager