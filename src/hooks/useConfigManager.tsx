import {  useState } from 'react'
import useStorageManager from './useStorageManager'

export const CONFIG_PERSIST_STATE = 'persistState'
export const CONFIG_NOTES_PER_PAGE = 'notesPerPage'

export type Settings = {
  persistState: boolean
  notesPerPage: number
}

const useConfigManager = () => {
  const { getItem, setItem, CONFIG_KEY } = useStorageManager()
  const [isConfigLoading, setIsConfigLoading] = useState(true)
  const [allConfig, setAllConfig] = useState<Settings>({
    persistState: false,
    notesPerPage: 10
  })

  const getConfig = async(
    key: keyof Settings
  ): Promise<Settings[keyof Settings] | null> => {
    const config = await loadConfig()
    return config ? config[key] ?? null : null
  }

  const setConfig = async (config: Settings) => {
    await loadConfig()
    setAllConfig(config)
    await setItem(CONFIG_KEY, config)
  }

  const getAllConfig = async ():Promise<Settings> => {
    return await loadConfig()
  }

  const loadConfig = async ():Promise<Settings> => {
    if (!isConfigLoading) {
      return allConfig
    }
    let config = await getItem(CONFIG_KEY)
    if(config){
      setAllConfig(config)
    }else{
      config = allConfig
    }
    
    setIsConfigLoading(false)
    return config
  }

  return {
    getConfig,
    getAllConfig,
    setAllConfig,
    setConfig,
    isConfigLoading,
    allConfig
  }
}

export default useConfigManager
