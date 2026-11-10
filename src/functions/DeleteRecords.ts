import { getBackendUrl } from "./ConnectToService";
import { fetchWithTimeout } from "./fetchWithTimeout";

export async function deleteRecordsFromBackend(
    nrZleceniaiPudlaList: string[]
): Promise<void> {
    let backendUrl: string;
    try {
        backendUrl = await getBackendUrl();
    } catch {
        throw new Error(
            "Brak aktywnego połączenia DNS z backendem. Wybierz urządzenie w ekranie połączenia."
        );
    }

    const response = await fetchWithTimeout(
        `${backendUrl}/android/deleteRecords`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nrZleceniaiPudlaList)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się usunąć pozycji: ${response.status}`
        );
    }
}