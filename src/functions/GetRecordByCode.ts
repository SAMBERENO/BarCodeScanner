import { getBackendUrl } from "./ConnectToService";

export type RecordsJson = {
    zmiana: string;
    nrWyrobu: string;
    nrZleceniaiPudla: string;
    dataProdukcji: string;
    sumaUszczelek: number;
    sumaBrakow: number;
    niezgodnosci: number;
    kz: number;
    braki: {
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
        F: number;
        G: number;
        H: number;
        I: number;
        J: number;
        K: number;
        L: number;
        M: number;
        N: number;
        O: number;
        P: number;
        R: number;
        S: number;
        T: number;
        U: number;
        V: number;
        W: number;
        X: number;
    };
};

export async function getRecordByCode(
    scannedCode: string
): Promise<RecordsJson> {

    const backendUrl = await getBackendUrl();

    const response = await fetch(
        `${backendUrl}/android/getJsonByID?nrZleceniaiPudla=${encodeURIComponent(scannedCode)}`,
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Nie udało się pobrać pozycji: ${response.status}`
        );
    }

    const record: RecordsJson = await response.json();

    return record;
}