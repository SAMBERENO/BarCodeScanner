import {useCallback, useEffect, useState} from "react";
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParams} from "@/navigation/navigationStack";
import type {DatabaseRecord} from "@/functions/GetAllRecords";
import {
    loadLocalRecords,
    subscribeToLocalRecords
} from "@/functions/LocalRecordsStore";
import {
    downloadRecordsFromBackend,
    uploadRecordsToBackend
} from "@/functions/SyncRecords";

type Props = NativeStackScreenProps<StackParams, "DatabaseRecordsScreen">;

export default function DatabaseRecordsScreen({navigation}: Props) {
    const [records, setRecords] = useState<DatabaseRecord[]>([]);
    const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadLocalRecords().then(setRecords);
        const unsubscribe = subscribeToLocalRecords(setRecords);
        return () => {
            unsubscribe();
        };
    }, []);

    // Przy wejściu na ekran wczytujemy TYLKO lokalną kopię.
    useFocusEffect(
        useCallback(() => {
            loadLocalRecords().then(setRecords);
        }, [])
    );

    function toggleRecord(nrZleceniaiPudla: string) {
        setExpandedRecords(previous => {
            const updated = new Set(previous);
            if (updated.has(nrZleceniaiPudla)) {
                updated.delete(nrZleceniaiPudla);
            } else {
                updated.add(nrZleceniaiPudla);
            }
            return updated;
        });
    }

    async function handleDownload() {
        if (isDownloading || isUploading) {
            return;
        }
        setIsDownloading(true);
        try {
            await downloadRecordsFromBackend();
            // setLocalRecords wyemituje zmianę przez subskrypcję,
            // ale dla pewności odświeżamy też ręcznie.
            const fresh = await loadLocalRecords();
            setRecords(fresh);
            Alert.alert("Sukces", "Pobrano bazę z backendu.");
        } catch (error) {
            Alert.alert(
                "Błąd",
                error instanceof Error ? error.message : String(error)
            );
        } finally {
            setIsDownloading(false);
        }
    }

    async function handleUpload() {
        if (isDownloading || isUploading) {
            return;
        }
        setIsUploading(true);
        try {
            await uploadRecordsToBackend();
            Alert.alert("Sukces", "Wysłano lokalną bazę na backend.");
        } catch (error) {
            Alert.alert(
                "Błąd",
                error instanceof Error ? error.message : String(error)
            );
        } finally {
            setIsUploading(false);
        }
    }

    function renderRecord({item}: {item: DatabaseRecord}) {
        const expanded = expandedRecords.has(
            item.recordsJson.nrZleceniaiPudla
        );
        return (
            <View
                style={[
                    styles.recordContainer,
                    item.zatwierdzone === 1
                        ? styles.approved
                        : styles.notApproved
                ]}>
                <View style={styles.header}>
                    <Pressable
                        style={styles.editButton}
                        onPress={() => {
                            navigation.navigate(
                                "RecordDetailsScreen",
                                {
                                    record: item.recordsJson,
                                    mode: "local"
                                }
                            );
                        }}>
                        <Text style={styles.editButtonText}>
                            ✎
                        </Text>
                    </Pressable>
                    <Text style={styles.recordNumber}>
                        {item.recordsJson.nrZleceniaiPudla}
                    </Text>
                    <Pressable
                        style={styles.expandButton}
                        onPress={() =>
                            toggleRecord(
                                item.recordsJson.nrZleceniaiPudla
                            )
                        }>
                        <Text style={styles.expandButtonText}>
                            {expanded ? "▼" : "▶"}
                        </Text>
                    </Pressable>
                </View>
                {expanded && (
                    <View style={styles.details}>
                        <Text style={styles.label}>
                            Zmiana
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.zmiana}
                        </Text>
                        <Text style={styles.label}>
                            Nr wyrobu
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.nrWyrobu}
                        </Text>
                        <Text style={styles.label}>
                            Data produkcji
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.dataProdukcji}
                        </Text>
                        <Text style={styles.label}>
                            Suma uszczelek
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.sumaUszczelek}
                        </Text>
                        <Text style={styles.label}>
                            Suma braków
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.sumaBrakow}
                        </Text>
                        <Text style={styles.label}>
                            Niezgodności
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.niezgodnosci}
                        </Text>
                        <Text style={styles.label}>
                            KZ
                        </Text>
                        <Text style={styles.value}>
                            {item.recordsJson.kz ? "1" : "0"}
                        </Text>
                        <Text style={styles.label}>
                            Zatwierdzone
                        </Text>
                        <Text style={styles.value}>
                            {item.zatwierdzone}
                        </Text>
                        <Text style={styles.sectionTitle}>
                            Braki
                        </Text>
                        {Object.entries(item.recordsJson.braki)
                            .filter(([key]) => key !== "values")
                            .map(([key, value]) => (
                                <View
                                    key={key}
                                    style={styles.brakRow}>
                                    <Text style={styles.brakName}>
                                        {key}
                                    </Text>
                                    <Text style={styles.brakValue}>
                                        {String(value)}
                                    </Text>
                                </View>
                            ))}
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Baza danych
            </Text>
            <FlatList
                data={records}
                keyExtractor={(item) =>
                    item.recordsJson.nrZleceniaiPudla
                }
                renderItem={renderRecord}
                contentContainerStyle={styles.listContent}/>
            <View style={styles.footer}>
                <Pressable
                    disabled={isDownloading || isUploading}
                    style={[
                        styles.footerButton,
                        (isDownloading || isUploading) && styles.footerButtonDisabled
                    ]}
                    onPress={handleDownload}>
                    <Text style={styles.footerButtonText}>
                        {isDownloading ? "Pobieranie..." : "Pobierz z backendu"}
                    </Text>
                </Pressable>
                <Pressable
                    disabled={isDownloading || isUploading}
                    style={[
                        styles.footerButton,
                        (isDownloading || isUploading) && styles.footerButtonDisabled
                    ]}
                    onPress={handleUpload}>
                    <Text style={styles.footerButtonText}>
                        {isUploading ? "Wysyłanie..." : "Wyślij na backend"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 20,
        backgroundColor: "#86C8E5"
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20
    },
    listContent: {
        paddingBottom: 10
    },
    recordContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    },
    approved: {
        backgroundColor: "#A3FFAB"
    },
    notApproved: {
        backgroundColor: "#ffd6d8"
    },
    header: {
        flexDirection: "row",
        alignItems: "center"
    },
    editButton: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    editButtonText: {
        fontSize: 20
    },
    recordNumber: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold"
    },
    expandButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    expandButtonText: {
        fontSize: 18
    },
    details: {
        marginTop: 15
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 12
    },
    value: {
        fontSize: 18,
        paddingVertical: 8,
        backgroundColor: "#86C8E5"
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10
    },
    brakRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    brakName: {
        width: 40,
        fontSize: 18
    },
    brakValue: {
        flex: 1,
        fontSize: 18,
        padding: 8
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        paddingTop: 10
    },
    footerButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center"
    },
    footerButtonDisabled: {
        opacity: 0.5
    },
    footerButtonText: {
        fontSize: 16,
        fontWeight: "bold"
    }
});