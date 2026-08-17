import {useCallback, useState} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";

export default function ShowWiFiConnection() {
    const [ wifiName, setWiFiName ] = useState<string>("Sprawdzanie...");

    const getWiFiName = async (): Promise<void> => {
        try {
            const permission = await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                setWiFiName("Nie uzyskano dostępu do nazwy Wi-Fi");
                return;
            }
            const networkState = await NetInfo.fetch();

            if (networkState.type !== "wifi") {
                setWiFiName("Brak połączenia Wi-Fi");
                return;
            }
            setWiFiName(
                networkState.details.ssid ?? "Nie udało się pozyskać nazwy Wi-Fi"
            );
        } catch (error) {
            console.error("Bład odczytu Wi-Fi", error);
            setWiFiName("Błąd odczytu sieci");
        }
    };
    useFocusEffect(useCallback(() => {getWiFiName();}, []));

    return (
            <Text>
                {wifiName}
            </Text>
    );
}