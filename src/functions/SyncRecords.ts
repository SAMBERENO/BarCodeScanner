import { getBackendUrl } from "./ConnectToService";
import { fetchWithTimeout } from "./fetchWithTimeout";
import type { DatabaseRecord } from "./GetAllRecords";
import type { RecordsJsonCollection } from "./DTO";
import {
    getLocalRecordsCollection,
    loadLocalRecords,
    markRecordsAsSynced,
    setLocalRecords,
    type LocalDatabaseRecord
} from "./LocalRecordsStore";

const NO_CONNECTION_MESSAGE =
    "Brak aktywnego połączenia DNS z backendem. Wybierz urządzenie w ekranie połączenia.";

async function requireBackendUrl(): Promise<string> {
    try {
        return await getBackendUrl();
    } catch {
        throw new Error(NO_CONNECTION_MESSAGE);
    }
}

export async function downloadRecordsFromBackend(): Promise<LocalDatabaseRecord[]> {
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

    const raw: DatabaseRecord[] = await response.json();
    const records: LocalDatabaseRecord[] = raw.map(record => ({
        ...record,
        zatwierdzoneLokalnie: 0
    }));

    await setLocalRecords(records);
    return records;
}

export async function uploadRecordsToBackend(): Promise<void> {
    const backendUrl = await requireBackendUrl();

    const collection: RecordsJsonCollection = await getLocalRecordsCollection();

    if (collection.records.length === 0) {
        throw new Error(
            "Brak zatwierdzonych lokalnie pozycji do wysłania."
        );
    }

    const response = await fetchWithTimeout(
        `${backendUrl}/android/updateRecords`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(collection)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się wysłać pozycji: ${response.status}`
        );
    }

    // Sukces — oznaczamy wysłane rekordy jako zatwierdzone przez backend.
    const sentKeys = collection.records.map(
        record => record.nrZleceniaiPudla
    );
    await markRecordsAsSynced(sentKeys);
}