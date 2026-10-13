import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DatabaseRecord } from "./GetAllRecords";

const STORAGE_KEY = "local_records_v1";

let cache: DatabaseRecord[] | null = null;
const listeners = new Set<(records: DatabaseRecord[]) => void>();

function emit() {
    if (!cache) return;
    for (const listener of listeners) {
        listener(cache);
    }
}

export function subscribeToLocalRecords(
    listener: (records: DatabaseRecord[]) => void
): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export async function loadLocalRecords(): Promise<DatabaseRecord[]> {
    if (cache) {
        return cache;
    }
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        cache = raw ? (JSON.parse(raw) as DatabaseRecord[]) : [];
    } catch (error) {
        console.error("Nie udało się odczytać lokalnej bazy:", error);
        cache = [];
    }
    return cache;
}

export async function setLocalRecords(
    records: DatabaseRecord[]
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
    updated: DatabaseRecord
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
        record.recordsJson.nrZleceniaiPudla === key ? updated : record
    );

    await setLocalRecords(next);
}