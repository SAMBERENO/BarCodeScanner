import {Alert} from "react-native";

export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 3000
): Promise<Response> {

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } catch (error) {
        Alert.alert("Przekroczono czas oczekiwania na backend");
        return Promise.reject(error);
    } finally {
        clearTimeout(timeoutId);
    }
}