import { getBackendUrl } from "./ConnectToService";
import { fetchWithTimeout } from "./fetchWithTimeout";
import type { RecordsJson } from "./DTO";

export async function addRecordToBackend(record: RecordsJson): Promise<void> {
    let backendUrl: string;
    try {
        backendUrl = await getBackendUrl();
    } catch {
        throw new Error(
            "Brak aktywnego połączenia DNS z backendem. Wybierz urządzenie w ekranie połączenia."
        );
    }

    const response = await fetchWithTimeout(
        `${backendUrl}/android/addJson`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się dodać pozycji: ${response.status}`
        );
    }
}