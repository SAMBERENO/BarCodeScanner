import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {BarcodeScanningResult, CameraView, useCameraPermissions} from "expo-camera";
import {styles} from "@/styles";
import {getRecordByCode} from "@/functions/GetRecordByCode";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParams } from "@/navigation/navigationStack";
type Props = NativeStackScreenProps<StackParams, "CodesScanner">;

export default function CodesScanner({ navigation }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    async function handleBarcodeScanned(result: BarcodeScanningResult) {
        setScanned(true);
        try {
            const record = await getRecordByCode(result.data);

            navigation.navigate("RecordDetailsScreen", {
                record: record
            });

            console.log("Odebrana pozycja:", record);
            console.log("Nr wyrobu:", record.nrWyrobu);
            console.log("Nr zlecenia:", record.nrZleceniaiPudla);

        } catch (error) {
            console.log("Błąd:", error);
        }
    }
    if (!permission) {
        return (
            <View style={localStyles.container}>
                <Text>Sprawdzanie uprawnień kamery...</Text>
            </View>
        );
    }
    if (!permission.granted) {
        return (
            <View style={localStyles.requestContainer}>
                <Text>Aplikacja potrzebuje dostępu do kamery</Text>
                <Pressable onPress={requestPermission}>
                    <View style={styles.middleRoundedRectangle}>
                        <Text style={styles.middleButtons}>
                            Udziel dostępu do kamery
                        </Text>
                    </View>
                </Pressable>
            </View>
        );
    }
    return (
        <View style={localStyles.container}>
            <CameraView
                style={localStyles.camera}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: [
                        "qr",
                        "ean13",
                        "ean8",
                        "code128",
                        "code39",
                        "upc_a",
                        "upc_e"
                    ]
                }}
                onBarcodeScanned={
                    scanned ? undefined : handleBarcodeScanned
                }
            />
            {scanned && (
                <View style={localStyles.footerContainer}>
                    <Pressable onPress={() => setScanned(false)}>
                        <Text style={localStyles.footerButton}>
                            Następny kod
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
            );}

const localStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    requestContainer:{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#86C8E5"
    },
    camera: {
        flex: 1
    },
    headerButton: {
        fontSize: 30,
        textAlign: "center",
        backgroundColor: "white",
        minWidth: "100%",
        height: 60
    },
    footerContainer: {
        paddingBottom: 50,
        justifyContent: "center",
    },
    footerButton: {
        fontSize: 45,
        height: 60,
        textAlign: "center",
        backgroundColor: "#08D8F5"
    }
})