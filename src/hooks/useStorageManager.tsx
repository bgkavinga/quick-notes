const useStorageManager = () => {
    const isChromeExtension = () => {
        return typeof chrome !== 'undefined' && chrome.storage;
    }
    const getItem = (key: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            if (isChromeExtension()) {
                chrome.storage.local.get(key, (result) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(result[key]);
                    }
                });
            } else {
                const item = localStorage.getItem(key);
                resolve(item ? JSON.parse(item) : null);
            }
        });
    }

    const setItem = (key: string, value: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (isChromeExtension()) {
                chrome.storage.local.set({ [key]: value }, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            } else {
                localStorage.setItem(key, JSON.stringify(value));
                resolve();
            }
        });
    }

    const removeItem = (key: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (isChromeExtension()) {
                chrome.storage.local.remove(key, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            } else {
                localStorage.removeItem(key);
                resolve();
            }
        });
    }

    return {
        setItem,
        getItem,
        removeItem
    }
}

export default useStorageManager;