import {useCallback, useEffect, useState} from "react";
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParams} from "@/navigation/navigationStack";
import {loadLocalRecords, subscribeToLocalRecords, removeLocalRecords, type LocalDatabaseRecord} from "@/functions/LocalRecordsStore";
import {downloadRecordsFromBackend, uploadRecordsToBackend} from "@/functions/SyncRecords";
import {deleteRecordsFromBackend} from "@/functions/DeleteRecords";

type Props = NativeStackScreenProps<StackParams, "DatabaseRecordsScreen">;

export default function DatabaseRecordsScreen({navigation}: Props) {
    const [records, setRecords] = useState<LocalDatabaseRecord[]>([]);
    const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
    const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadLocalRecords().then(setRecords);
        const unsubscribe = subscribeToLocalRecords(setRecords);
        return () => {
            unsubscribe();
        };
    }, []);

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

    function toggleSelection(nrZleceniaiPudla: string) {
        setSelectedRecords(previous => {
            const updated = new Set(previous);
            if (updated.has(nrZleceniaiPudla)) {
                updated.delete(nrZleceniaiPudla);
            } else {
                updated.add(nrZleceniaiPudla);
            }
            return updated;
        });
    }

    function enterSelectionMode() {
        setIsSelectionMode(true);
        setSelectedRecords(new Set());
    }

    function exitSelectionMode() {
        setIsSelectionMode(false);
        setSelectedRecords(new Set());
    }

    function toggleSelectionMode() {
        if (isSelectionMode) {
            exitSelectionMode();
        } else {
            enterSelectionMode();
        }
    }

    async function confirmDownload() {
        if (isDownloading || isUploading || isDeleting) {
            return;
        }
        Alert.alert(
            "Pobieranie z backendu",
            "Czy na pewno chcesz pobrać bazę danych z backendu? Spowoduje to nadpisanie lokalnej kopii.",
            [
                {
                    text: "Nie",
                    style: "cancel"
                },
                {
                    text: "Pobierz",
                    onPress: handleDownload
                }
            ]
        );
    }

    function confirmUpload() {
        if (isDownloading || isUploading || isDeleting) {
            return;
        }
        Alert.alert(
            "Wysyłanie na backend",
            "Czy na pewno chcesz wysłać zatwierdzone pozycje na backend?",
            [
                {
                    text: "Nie",
                    style: "cancel"
                },
                {
                    text: "Wyślij",
                    onPress: handleUpload
                }
            ]
        );
    }

    async function handleDownload() {
        if (isDownloading || isUploading || isDeleting) {
            return;
        }
        setIsDownloading(true);
        try {
            await downloadRecordsFromBackend();
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
        if (isDownloading || isUploading || isDeleting) {
            return;
        }
        setIsUploading(true);
        try {
            await uploadRecordsToBackend();
            Alert.alert("Sukces", "Wysłano zatwierdzone pozycje na backend.");
        } catch (error) {
            Alert.alert(
                "Błąd",
                error instanceof Error ? error.message : String(error)
            );
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDeleteSelected() {
        if (isDownloading || isUploading || isDeleting) {
            return;
        }
        if (selectedRecords.size === 0) {
            return;
        }

        const keys = Array.from(selectedRecords);
        setIsDeleting(true);
        try {
            await deleteRecordsFromBackend(keys);
            await removeLocalRecords(keys);
            const fresh = await loadLocalRecords();
            setRecords(fresh);
            Alert.alert("Sukces", "Usunięto pozycje");
            exitSelectionMode();
        } catch (error) {
            Alert.alert(
                "Błąd",
                error instanceof Error ? error.message : String(error)
            );
        } finally {
            setIsDeleting(false);
        }
    }

    function renderRecord({item}: {item: LocalDatabaseRecord}) {
        const key = item.recordsJson.nrZleceniaiPudla;
        const expanded = expandedRecords.has(key);
        const selected = selectedRecords.has(key);

        const recordStyle =
            item.zatwierdzone === 1
                ? styles.approved
                : item.zatwierdzoneLokalnie === 1
                    ? styles.approvedLocally
                    : styles.notApproved;

        return (
            <View style={[styles.recordContainer, recordStyle]}>
                <View style={styles.header}>
                    <Pressable
                        style={styles.editButton}
                        onPress={() => {
                            if (isSelectionMode) {
                                return;
                            }
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
                    {isSelectionMode && (
                        <Pressable
                            style={styles.checkbox}
                            onPress={() => toggleSelection(key)}>
                            <Text style={styles.checkboxMark}>
                                {selected ? "✓" : ""}
                            </Text>
                        </Pressable>
                    )}
                    <Pressable
                        style={styles.expandButton}
                        onPress={() => toggleRecord(key)}>
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
            <View style={styles.titleRow}>
                <Text style={styles.title}>
                    Baza danych
                </Text>
                <Pressable
                    style={styles.deleteModeButton}
                    onPress={toggleSelectionMode}>
                    <Text style={styles.deleteModeButtonText}>
                        Usuń
                    </Text>
                </Pressable>
            </View>
            <FlatList
                data={records}
                keyExtractor={(item) =>
                    item.recordsJson.nrZleceniaiPudla
                }
                renderItem={renderRecord}
                contentContainerStyle={styles.listContent}/>
            <View style={styles.footer}>
                {isSelectionMode ? (
                    <Pressable
                        disabled={isDeleting}
                        style={[
                            styles.footerPressable,
                            isDeleting && styles.footerDisabled
                        ]}
                        onPress={handleDeleteSelected}>
                        <View style={styles.footerRoundedRectangle}>
                            <Text style={styles.footerButtons}>
                                {isDeleting ? "Usuwanie..." : "Usuń zaznaczone"}
                            </Text>
                        </View>
                    </Pressable>
                ) : (
                    <>
                        <Pressable
                            disabled={isDownloading || isUploading}
                            style={[
                                styles.footerPressable,
                                (isDownloading || isUploading) && styles.footerDisabled
                            ]}
                            onPress={confirmDownload}>
                            <View style={styles.footerRoundedRectangle}>
                                <Text style={styles.footerButtons}>
                                    {isDownloading ? "Pobieranie..." : "Pobierz z backendu"}
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable
                            disabled={isDownloading || isUploading}
                            style={[
                                styles.footerPressable,
                                (isDownloading || isUploading) && styles.footerDisabled
                            ]}
                            onPress={confirmUpload}>
                            <View style={styles.footerRoundedRectangle}>
                                <Text style={styles.footerButtons}>
                                    {isUploading ? "Wysyłanie..." : "Wyślij na backend"}
                                </Text>
                            </View>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 5,
        backgroundColor: "#86C8E5"
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20
    },
    title: {
        fontSize: 26,
        fontWeight: "bold"
    },
    deleteModeButton: {
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    deleteModeButtonText: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#B00020"
    },
    listContent: {
        paddingBottom: 10,
        paddingHorizontal: 20
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
    approvedLocally: {
        backgroundColor: "#fffc4d"
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
    checkbox: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        backgroundColor: "white"
    },
    checkboxMark: {
        fontSize: 20,
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
        alignItems: "center",
        height: "16%",
        gap: 10,
        paddingTop: 2,
        paddingBottom: 44,
        paddingHorizontal: 3
    },
    footerPressable: {
        width: "49%"
    },
    footerRoundedRectangle: {
        borderRadius: 5,
        borderWidth: 2,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        backgroundColor: "white"
    },
    footerButtons: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    },
    footerDisabled: {
        opacity: 0.5
    }
});