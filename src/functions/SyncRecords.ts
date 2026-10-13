import { getBackendUrl } from "./ConnectToService";
import { fetchWithTimeout } from "./fetchWithTimeout";
import type { DatabaseRecord } from "./GetAllRecords";
import { loadLocalRecords, setLocalRecords } from "./LocalRecordsStore";

const NO_CONNECTION_MESSAGE =
    "Brak aktywnego połączenia DNS z backendem. Wybierz urządzenie w ekranie połączenia.";

async function requireBackendUrl(): Promise<string> {
    try {
        return await getBackendUrl();
    } catch {
        throw new Error(NO_CONNECTION_MESSAGE);
    }
}

export async function downloadRecordsFromBackend(): Promise<DatabaseRecord[]> {
    const backendUrl = await requireBackendUrl();

    const response = await fetchWithTimeout(
        `${backendUrl}/android/getAllRecords`,
        { method: "GET" }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się pobrać pozycji: ${response.status}`
        );
    }

    const records: DatabaseRecord[] = await response.json();
    await setLocalRecords(records);
    return records;
}

export async function uploadRecordsToBackend(): Promise<void> {
    const backendUrl = await requireBackendUrl();
    const records = await loadLocalRecords();

    const response = await fetchWithTimeout(
        `${backendUrl}/android/updateRecords`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(records)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się wysłać pozycji: ${response.status}`
        );
    }
}