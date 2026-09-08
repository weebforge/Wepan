export interface StoreSchema {
  accessToken: string;
}

export class Store {
  static get<K extends keyof StoreSchema>(key: K): StoreSchema[K] | undefined {
    const value = localStorage.getItem(key as string);
    if (value === null) return undefined;
    try {
      return JSON.parse(value) as StoreSchema[K];
    } catch (error) {
      console.error(`Error parsing value for key "${String(key)}":`, error);
      return undefined;
    }
  }

  static set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
    try {
      localStorage.setItem(key as string, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting value for key "${String(key)}":`, error);
    }
  }

  static getOrSet<K extends keyof StoreSchema>(
    key: K,
    defaultValue: StoreSchema[K],
  ): StoreSchema[K] {
    const existingValue = this.get(key);
    if (existingValue !== undefined) {
      return existingValue;
    }
    this.set(key, defaultValue);
    return defaultValue;
  }

  static remove<K extends keyof StoreSchema>(key: K): void {
    try {
      localStorage.removeItem(key as string);
    } catch (error) {
      console.error(`Error removing value for key "${String(key)}":`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}
