import {useState} from "react";
import {Alert, Pressable, ScrollView, Text, TextInput, View, StyleSheet} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParams} from "@/navigation/navigationStack";
import type {RecordsJson} from "@/functions/DTO";
import {addRecordToBackend} from "@/functions/AddRecord";
import {addLocalRecord, type LocalDatabaseRecord} from "@/functions/LocalRecordsStore";

type Props = NativeStackScreenProps<StackParams, "AddRecordScreen">;

const EMPTY_BRAKI = {
    A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0,
    J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, R: 0,
    S: 0, T: 0, U: 0, V: 0, W: 0, X: 0
};

function emptyForm() {
    return {
        zmiana: "",
        nrWyrobu: "",
        nrZleceniaiPudla: "",
        dataProdukcji: "",
        sumaUszczelek: "",
        sumaBrakow: "",
        niezgodnosci: "",
        kz: "",
        braki: {...EMPTY_BRAKI}
    };
}

export default function AddRecordScreen({navigation}: Props) {
    const [zmiana, setZmiana] = useState("");
    const [nrWyrobu, setNrWyrobu] = useState("");
    const [nrZleceniaiPudla, setNrZleceniaiPudla] = useState("");
    const [dataProdukcji, setDataProdukcji] = useState("");
    const [sumaUszczelek, setSumaUszczelek] = useState("");
    const [sumaBrakow, setSumaBrakow] = useState("");
    const [niezgodnosci, setNiezgodnosci] = useState("");
    const [kz, setKz] = useState("");
    const [braki, setBraki] = useState({...EMPTY_BRAKI});
    const [isSaving, setIsSaving] = useState(false);

    function resetForm() {
        const empty = emptyForm();
        setZmiana(empty.zmiana);
        setNrWyrobu(empty.nrWyrobu);
        setNrZleceniaiPudla(empty.nrZleceniaiPudla);
        setDataProdukcji(empty.dataProdukcji);
        setSumaUszczelek(empty.sumaUszczelek);
        setSumaBrakow(empty.sumaBrakow);
        setNiezgodnosci(empty.niezgodnosci);
        setKz(empty.kz);
        setBraki(empty.braki);
    }

    function changeBrak(
        key: keyof typeof braki,
        value: string
    ) {
        setBraki(previous => ({
            ...previous,
            [key]: value === "" ? 0 : Number(value)
        }));
    }

    function buildRecord(): RecordsJson {
        return {
            zmiana: zmiana,
            nrWyrobu: nrWyrobu,
            nrZleceniaiPudla: nrZleceniaiPudla,
            dataProdukcji: dataProdukcji,
            sumaUszczelek: sumaUszczelek === "" ? 0 : Number(sumaUszczelek),
            sumaBrakow: sumaBrakow === "" ? 0 : Number(sumaBrakow),
            niezgodnosci: niezgodnosci === "" ? 0 : Number(niezgodnosci),
            kz: kz === "" ? 0 : Number(kz),
            braki: braki
        };
    }

    async function handleAdd() {
        if (isSaving) {
            return;
        }

        // Minimalna walidacja — nrZleceniaiPudla jest kluczem rekordu.
        if (nrZleceniaiPudla.trim() === "") {
            Alert.alert("Błąd", "Pole „Nr zlecenia i pudła” nie może być puste.");
            return;
        }

        setIsSaving(true);
        try {
            const record = buildRecord();

            await addRecordToBackend(record);

            const localRecord: LocalDatabaseRecord = {
                recordsJson: record,
                zatwierdzone: 0,
                zatwierdzoneLokalnie: 0
            };
            await addLocalRecord(localRecord);

            Alert.alert("Sukces", "Dodano pozycję!");
            resetForm();
        } catch (error) {
            Alert.alert(
                "Błąd",
                error instanceof Error ? error.message : String(error)
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>
                Dodaj pozycję
            </Text>

            <Text style={styles.label}>
                Zmiana
            </Text>
            <TextInput
                style={styles.input}
                value={zmiana}
                onChangeText={setZmiana}
                keyboardType="default"
                maxLength={1}
            />

            <Text style={styles.label}>
                Nr wyrobu
            </Text>
            <TextInput
                style={styles.input}
                value={nrWyrobu}
                onChangeText={setNrWyrobu}
                keyboardType="default"
            />

            <Text style={styles.label}>
                Nr zlecenia i pudła
            </Text>
            <TextInput
                style={styles.input}
                value={nrZleceniaiPudla}
                onChangeText={setNrZleceniaiPudla}
                keyboardType="default"
            />

            <Text style={styles.label}>
                Data produkcji
            </Text>
            <TextInput
                style={styles.input}
                value={dataProdukcji}
                keyboardType="default"
                onChangeText={(text) => {
                    const filtered = text.replace(/[^0-9.]/g, "");
                    setDataProdukcji(filtered);
                }}
            />

            <Text style={styles.label}>
                Suma uszczelek
            </Text>
            <TextInput
                style={styles.input}
                value={sumaUszczelek}
                onChangeText={setSumaUszczelek}
                keyboardType="numeric"
            />

            <Text style={styles.label}>
                Suma braków
            </Text>
            <TextInput
                style={styles.input}
                value={sumaBrakow}
                onChangeText={setSumaBrakow}
                keyboardType="numeric"
            />

            <Text style={styles.label}>
                Niezgodności
            </Text>
            <TextInput
                style={styles.input}
                value={niezgodnosci}
                onChangeText={setNiezgodnosci}
                keyboardType="numeric"
            />

            <Text style={styles.label}>
                KZ (0 lub 1)
            </Text>
            <TextInput
                style={styles.input}
                value={kz}
                onChangeText={(text) => {
                    const filtered = text.replace(/[^01]/g, "").slice(0, 1);
                    setKz(filtered);
                }}
                keyboardType="numeric"
                maxLength={1}
            />

            <Text style={styles.sectionTitle}>
                Braki
            </Text>
            {Object.entries(braki)
                .filter(([key]) => key !== "values")
                .map(([key, value]) => (
                    <View
                        key={key}
                        style={styles.brakRow}
                    >
                        <Text style={styles.brakName}>
                            {key}
                        </Text>

                        <TextInput
                            style={styles.brakInput}
                            value={value === 0 ? "" : String(value)}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                changeBrak(
                                    key as keyof typeof braki,
                                    text
                                )
                            }/>
                    </View>
                ))}

            <Pressable
                style={styles.confirmButton}
                onPress={handleAdd}
                disabled={isSaving}>
                <Text style={styles.confirmButtonText}>
                    {isSaving ? "Dodawanie..." : "Dodaj"}
                </Text>
            </Pressable>

            <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>
                    Powrót
                </Text>
            </Pressable>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 60
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 12
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 18,
        marginTop: 5
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
    brakInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 18
    },
    confirmButton: {
        marginTop: 30,
        padding: 16,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "lightgreen"
    },
    confirmButtonText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    backButton: {
        marginTop: 12,
        padding: 16,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "white",
        borderWidth: 2
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: "bold"
    }
});