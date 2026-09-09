import {getBackendUrl} from "./ConnectToService";
import { Alert } from "react-native";
import {fetchWithTimeout} from "@/functions/fetchWithTimeout";

export async function createLists(): Promise<void> {
    const backendUrl = await getBackendUrl();

    const response = await fetchWithTimeout(
        `${backendUrl}/android/createLists`,
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Błąd podczas wywołania /android/createLists: ${response.status}`
        );
    }

    if (response.ok) {
        Alert.alert("Utworzono pliki Excel")
    }
}