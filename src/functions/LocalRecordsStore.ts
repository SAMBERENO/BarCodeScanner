import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DatabaseRecord } from "./GetAllRecords";
import type { RecordsJsonCollection } from "./DTO";

const STORAGE_KEY = "local_records_v1";

/**
 * Lokalny rekord — rozszerzenie DatabaseRecord o flagę tylko-mobilną.
 * `zatwierdzoneLokalnie` NIE jest wysyłane na backend.
 */
export type LocalDatabaseRecord = DatabaseRecord & {
    zatwierdzoneLokalnie: number;
};

let cache: LocalDatabaseRecord[] | null = null;
const listeners = new Set<(records: LocalDatabaseRecord[]) => void>();

function emit() {
    if (!cache) return;
    for (const listener of listeners) {
        listener(cache);
    }
}

export function subscribeToLocalRecords(
    listener: (records: LocalDatabaseRecord[]) => void
): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export async function loadLocalRecords(): Promise<LocalDatabaseRecord[]> {
    if (cache) {
        return cache;
    }
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw
            ? (JSON.parse(raw) as LocalDatabaseRecord[])
            : [];
        // Zabezpieczenie: stare rekordy bez flagi dostają domyślne 0.
        cache = parsed.map(record => ({
            ...record,
            zatwierdzoneLokalnie: record.zatwierdzoneLokalnie ?? 0
        }));
    } catch (error) {
        console.error("Nie udało się odczytać lokalnej bazy:", error);
        cache = [];
    }
    return cache;
}

export async function setLocalRecords(
    records: LocalDatabaseRecord[]
): Promise<void> {
    cache = records;
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
        console.error("Nie udało się zapisać lokalnej bazy:", error);
    }
    emit();
}

export async function clearLocalRecords(): Promise<void> {
    cache = [];
    await AsyncStorage.removeItem(STORAGE_KEY);
    emit();
}

export async function updateLocalRecord(
    updated: LocalDatabaseRecord
): Promise<void> {
    const current = await loadLocalRecords();
    const key = updated.recordsJson.nrZleceniaiPudla;

    const exists = current.some(
        record => record.recordsJson.nrZleceniaiPudla === key
    );

    if (!exists) {
        return;
    }

    const next = current.map(record =>
        record.recordsJson.nrZleceniaiPudla === key
            ? { ...updated, zatwierdzoneLokalnie: 1 }
            : record
    );

    await setLocalRecords(next);
}

export async function getLocalRecordsCollection(): Promise<RecordsJsonCollection> {
    const records = await loadLocalRecords();
    return {
        records: records
            .filter(record => record.zatwierdzoneLokalnie === 1)
            .map(record => record.recordsJson)
    };
}

export async function markRecordsAsSynced(
    nrZleceniaiPudlaList: string[]
): Promise<void> {
    const current = await loadLocalRecords();
    const keys = new Set(nrZleceniaiPudlaList);

    const next = current.map(record =>
        keys.has(record.recordsJson.nrZleceniaiPudla)
            ? {
                ...record,
                zatwierdzone: 1,
                zatwierdzoneLokalnie: 0
            }
            : record
    );

    await setLocalRecords(next);
}