import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Service } from "@inthepocket/react-native-service-discovery";

const BACKEND_URL_KEY = "selectedBackendUrl";
const BACKEND_NAME_KEY = "selectedBackendName";

export async function ConnectToService(service: Service): Promise<void> {
    const address = service.addresses?.find(
        currentAddress => currentAddress.includes(".")
    );

    if (!address) {
        throw new Error("Usługa nie posiada adresu IPv4");
    }

    const backendUrl = `http://${address}:${service.port}`;

    const response = await fetch(`${backendUrl}/test`);

    if (!response.ok) {
        throw new Error(
            `Backend odpowiedział kodem HTTP ${response.status}`
        );
    }

    await AsyncStorage.setItem(BACKEND_URL_KEY, backendUrl);
    await AsyncStorage.setItem(BACKEND_NAME_KEY, service.name);
}

export async function getBackendUrl(): Promise<string> {
    const backendUrl = await AsyncStorage.getItem(BACKEND_URL_KEY);

    if (!backendUrl) {
        throw new Error("Nie wybrano backendu");
    }

    return backendUrl;
}

export async function getBackendName(): Promise<string | null> {
    const name = await AsyncStorage.getItem(BACKEND_NAME_KEY);
    console.log("Odczytano backend:", name);
    return name
}

export async function disconnectBackend(): Promise<void> {
    await AsyncStorage.removeItem(BACKEND_URL_KEY);
    await AsyncStorage.removeItem(BACKEND_NAME_KEY);
}