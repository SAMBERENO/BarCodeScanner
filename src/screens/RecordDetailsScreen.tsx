import {useState} from "react";
import { ScrollView, Text, TextInput, View, StyleSheet } from "react-native";

import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParams} from "@/navigation/navigationStack";

type Props = NativeStackScreenProps<
    StackParams,
    "RecordDetailsScreen"
>;

export default function RecordDetailsScreen({route}: Props) {

    const record = route.params.record;

    const [sumaBrakow, setSumaBrakow] =
        useState(String(record.sumaBrakow));

    const [niezgodnosci, setNiezgodnosci] =
        useState(String(record.niezgodnosci));

    const [kz, setKz] =
        useState(String(record.kz));

    const [braki, setBraki] =
        useState({...record.braki});


    function changeBrak(
        key: keyof typeof braki,
        value: string
    ) {
        setBraki(previous => ({
            ...previous,
            [key]: Number(value)
        }));
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>
                Dane rekordu
            </Text>


            <Text style={styles.label}>Zmiana</Text>
            <Text style={styles.value}>
                {record.zmiana}
            </Text>

            <Text style={styles.label}>Nr wyrobu</Text>
            <Text style={styles.value}>
                {record.nrWyrobu}
            </Text>

            <Text style={styles.label}>
                Nr zlecenia i pudła
            </Text>
            <Text style={styles.value}>
                {record.nrZleceniaiPudla}
            </Text>

            <Text style={styles.label}>
                Data produkcji
            </Text>
            <Text style={styles.value}>
                {record.dataProdukcji}
            </Text>

            <Text style={styles.label}>
                Suma uszczelek
            </Text>
            <Text style={styles.value}>
                {record.sumaUszczelek}
            </Text>


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
                KZ
            </Text>

            <TextInput
                style={styles.input}
                value={kz}
                onChangeText={setKz}
                keyboardType="numeric"
            />


            <Text style={styles.sectionTitle}>
                Braki
            </Text>

            {Object.entries(braki).map(([key, value]) => (
                <View
                    key={key}
                    style={styles.brakRow}
                >
                    <Text style={styles.brakName}>
                        {key}
                    </Text>

                    <TextInput
                        style={styles.brakInput}
                        value={String(value)}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                            changeBrak(
                                key as keyof typeof braki,
                                text
                            )
                        }
                    />
                </View>
            ))}

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

    value: {
        fontSize: 18,
        paddingVertical: 8
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
    }
});