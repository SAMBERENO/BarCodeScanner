import {getBackendUrl} from "./ConnectToService";
import { Alert } from "react-native";
import {fetchWithTimeout} from "@/functions/fetchWithTimeout";
import {downloadRecordsFromBackend} from "@/functions/SyncRecords";

export async function createLists(): Promise<void> {
    let excelCreated = false;
    try {
        const backendUrl = await getBackendUrl();
        const response = await fetchWithTimeout(
            `${backendUrl}/android/createLists`,
            {
                method: "GET"
            }
        );

        if (!response.ok) {
            Alert.alert(
                "Błąd",
                response.statusText || `Backend odpowiedział kodem ${response.status}`
            );
            return;
        }

        excelCreated = true;
    } catch (error) {
        Alert.alert(
            "Błąd",
            error instanceof Error ? error.message : String(error)
        );
        return;
    }

    try {
        await downloadRecordsFromBackend();
        Alert.alert("Sukces", "Utworzono pliki Excel");
    } catch (error) {
        Alert.alert(
            "Częściowy sukces",
            "Utworzono pliki Excel, ale nie udało się odświeżyć lokalnej bazy:\n" +
            (error instanceof Error ? error.message : String(error))
        );
    }
}