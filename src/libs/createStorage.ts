import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SimpleStorage<T> {
  get(): Promise<T | null>;
  update(val: T | null): Promise<void>;
}

export const createStorage = <T>(key: string, stringify = true): SimpleStorage<T> => ({
  async get(): Promise<T | null> {
    const item = await AsyncStorage.getItem(key);
    if (item) {
      if (stringify) {
        return JSON.parse(item);
      } else {
        return item as unknown as T;
      }
    } else {
      return null;
    }
  },
  update<T>(val: T | null): Promise<void> {
    if (val) {
      const item = stringify ? JSON.stringify(val) : val;
      return AsyncStorage.setItem(key, item as string);
    } else {
      return AsyncStorage.removeItem(key);
    }
  },
});
