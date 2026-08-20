import { getBackendUrl } from "./ConnectToService";
import type { RecordsJson } from "./GetRecordByCode";

export async function updateRecord(
    record: RecordsJson
): Promise<void> {

    const backendUrl = await getBackendUrl();

    const response = await fetch(
        `${backendUrl}/android/updateRecord`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się zaktualizować pozycji: ${response.status}`
        );
    }
}