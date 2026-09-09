export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 3000
): Promise<Response> {

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error("Przekroczono czas oczekiwania na backend");
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}