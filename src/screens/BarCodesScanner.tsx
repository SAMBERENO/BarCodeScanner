import {useState} from "react";
import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import {BarcodeScanningResult, CameraView, useCameraPermissions} from "expo-camera";
import {styles} from "@/styles";
import {getRecordByCode} from "@/functions/GetRecordByCode";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParams} from "@/navigation/navigationStack";
type Props = NativeStackScreenProps<StackParams, "BarCodesScanner">;

export default function BarCodesScanner({ navigation }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [cameraWidth, setCameraWidth] = useState(0.0);
    const [cameraHeight, setCameraHeight] = useState(0.0);
    const middleWidth = cameraWidth/2;
    const middleHeight = cameraHeight/2;

    async function handleBarcodeScanned(result: BarcodeScanningResult) {
        if (focusMode) {

            const barcodeCenterX =
                result.bounds.origin.x +
                result.bounds.size.width / 2;

            const barcodeCenterY =
                result.bounds.origin.y +
                result.bounds.size.height / 2;

            const scannerLeft = middleWidth - parseFloat(localStyles.scannerFrame.width)/2;
            const scannerRight = middleWidth + parseFloat(localStyles.scannerFrame.width)/2;

            const scannerTop = middleHeight - parseFloat(localStyles.scannerFrame.height)/2;
            const scannerBottom = middleHeight + parseFloat(localStyles.scannerFrame.height)/2;

            const isInsideScanner =
                barcodeCenterX >= scannerLeft &&
                barcodeCenterX <= scannerRight &&
                barcodeCenterY >= scannerTop &&
                barcodeCenterY <= scannerBottom;


            if (!isInsideScanner) {
                return;
            }
        }

        setScanned(true);

        try {
            const record = await getRecordByCode(result.data);

            navigation.navigate(
                "RecordDetailsScreen",
                {
                    record: record
                }
            );

        } catch (error) {
            Alert.alert(
                "Błąd",
                error instanceof Error
                    ? error.message
                    : String(error)
            );
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
        <View style={localStyles.container}
              onLayout={(event) => {

                  const { width, height } =
                      event.nativeEvent.layout;

                  setCameraWidth(width);
                  setCameraHeight(height);
              }}>
            <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                onBarcodeScanned={
                    scanned
                        ? undefined
                        : handleBarcodeScanned
                }
            />
            {focusMode && (
                <View
                    pointerEvents="none"
                    style={localStyles.scannerFrame}
                />
            )}
            {!scanned && (
                <View style={localStyles.footerContainer}>
                    <Pressable onPress={() => setFocusMode
                    (previous => !previous)}>
                        <Text style={localStyles.footerButton}>
                        {focusMode ? "Wyłącz tryb skupienia" : "Tryb skupienia"}
                        </Text>
                    </Pressable>
                </View>
            )}
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
    },
    scannerFrame: {
        position: "absolute",

        width: "100%",
        height: "10%",

        top: "40%",

        borderWidth: 3,
        borderColor: "red"
    },

    focusButton: {
        height: 70,
        marginHorizontal: 20,
        marginBottom: 40,

        justifyContent: "center",
        alignItems: "center",

        borderRadius: 10,
        backgroundColor: "lightgray"
    }
})