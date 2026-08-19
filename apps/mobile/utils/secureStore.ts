import { deleteItemAsync, setItemAsync } from "expo-secure-store";
import { Platform } from "react-native";

export async function setStorageItemAsync(key: string, value: string) {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Local storage is unavailable:", error);
    }
  } else {
    await setItemAsync(key, value);
  }
}

export async function removeStorageItemAsync(key: string) {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Local storage is unavailable:", error);
    }
  } else {
    await deleteItemAsync(key);
  }
}
