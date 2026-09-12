import { fetchWithTimeout } from "@/functions/fetchWithTimeout";
import {Alert} from "react-native";
import {getBackendUrl} from "@/functions/ConnectToService";

export async function addPdfRecords(): Promise<void> {
    const backendUrl = await getBackendUrl();
    const response = await fetchWithTimeout(
        `${backendUrl}/android/addPDFRecords`,
        {
            method: "POST"
        }
    );
    if (!response.ok) {
        Alert.alert("Coś poszło nie tak");
    }
    if (response.ok) {
        Alert.alert("Odczytano PDF");
    }
}