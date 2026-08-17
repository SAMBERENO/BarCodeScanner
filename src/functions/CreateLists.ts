import {getBackendUrl} from "./ConnectToService";
import { Alert } from "react-native";

export async function createLists(): Promise<void> {
    const backendUrl = await getBackendUrl();


    //TODO: Zrobić endpointa w Java obsługującego ten segment
    const countResponse = await fetch(
        `${backendUrl}/android/count`,
        {
            method: "GET"
        }
    );

    if (!countResponse.ok) {
        throw new Error(
            `Błąd podczas pobierania ilości pozycji: ${countResponse.status}`
        );
    }

    const count = Number(await countResponse.text());

    if (count <= 0) {
        Alert.alert("Brak pozycji w bazie danych");
        return;
    }

    const response = await fetch(
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