import { getBackendUrl } from "./ConnectToService";
import type { RecordsJson } from "./GetRecordByCode";
import {fetchWithTimeout} from "@/functions/fetchWithTimeout";
export type DatabaseRecord = {
    recordsJson: RecordsJson;
    zatwierdzone: number;
};
export async function getAllRecords(): Promise<DatabaseRecord[]> {
    const backendUrl = await getBackendUrl();
    const response = await fetchWithTimeout(
        `${backendUrl}/android/getAllRecords`,
        {
            method: "GET"
        }
    );
    if (!response.ok) {
        throw new Error(
            `Nie udało się pobrać pozycji: ${response.status}`
        );
    }
    const records: DatabaseRecord[] = await response.json();
    return records;
}