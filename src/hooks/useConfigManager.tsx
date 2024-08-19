import { useEffect, useState } from 'react'
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
  const getConfig = (
    key: keyof Settings
  ): (Settings[keyof Settings] | null) => {
    console.log('allConfig',allConfig)
    return allConfig ? allConfig[key] ?? null : null
  }

  const setConfig = async (config: Settings) => {
    setAllConfig(config)
    await setItem(CONFIG_KEY, config)
  }


  useEffect(() => {
    (async () => {
      const savedConfig = await getItem(CONFIG_KEY)
      setAllConfig(savedConfig)
      setIsConfigLoading(false)
      console.log('config')
    })()
  },  [])

  return {
    getConfig,
    setAllConfig,
    setConfig,
    isConfigLoading,
    allConfig
  }
}

export default useConfigManager
