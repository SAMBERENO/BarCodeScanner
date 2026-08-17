import {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import * as ServiceDiscovery from "@inthepocket/react-native-service-discovery";
import {Service} from "@inthepocket/react-native-service-discovery";
import {FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator, Alert} from "react-native";
import {ConnectToService, getBackendName} from "@/functions/ConnectToService"

export default function LfDnsConnection() {
    const [services, setServices] = useState<Service[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            getBackendName()
                .then(savedName => {
                    setSelectedServiceName(savedName);
                })
                .catch(error => {
                    console.error("Błąd odczytu wybranej usługi:", error);
                });
            const foundListener = ServiceDiscovery.addEventListener(
                "serviceFound",
                service => {
                    console.log("Service found:", service);

                    setServices(previousServices => {
                        const alreadyExists = previousServices.some(
                            existingService =>
                                existingService.name === service.name &&
                                existingService.port === service.port
                        );
                        if (alreadyExists) {
                            return previousServices;
                        }
                        return [...previousServices, service];});});
            const lostListener = ServiceDiscovery.addEventListener(
                "serviceLost",
                service => {
                    console.log("Service lost:", service);

                    setServices(previousServices =>
                        previousServices.filter(
                            existingService =>
                                !(
                                    existingService.name === service.name &&
                                    existingService.port === service.port
                                )));});
            ServiceDiscovery.startSearch("http").catch(error => {
                console.error("Nie udało się rozpocząć wyszukiwania:", error);
            });
            return () => {
                ServiceDiscovery.stopSearch("http").catch(error => {console.error("Nie udało się zatrzymać wyszukiwania:", error);});
                foundListener.remove();
                lostListener.remove();
            };
        }, [] )
    );

    return (
        <View style={localStyles.middleContainer}>
            <FlatList
                data={services}
                renderItem={({item}) =>
                    (<Pressable
                        disabled={isConnecting}
                        style={[
                            localStyles.serviceItem,
                            selectedServiceName === item.name && localStyles.selectedService
                        ]}
                        onPress={async () => {
                            setIsConnecting(true);

                            try {
                                await ConnectToService(item);
                                setSelectedServiceName(item.name);

                                Alert.alert(
                                    "Połączono",
                                    `Wybrano backend: ${item.name}`
                                );
                            } catch (error) {
                                Alert.alert(
                                    "Błąd połączenia",
                                    error instanceof Error
                                        ? error.message
                                        : String(error)
                                );
                            } finally {
                                setIsConnecting(false);
                            }
                        }}>
                    <Text>
                        {item.name} — {item.addresses?.[0]}:{item.port}
                    </Text>
                        {isConnecting && (
                            <Text>Trwa łączenie z backendem...</Text>
                        ) && <ActivityIndicator />}
                    </Pressable>)}
                keyExtractor={(item, index) => `${item.name}-${item.port}-${index}`}/>
        </View>
    );
}

const localStyles = StyleSheet.create({
    middleContainer:{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "72%"
    },
    selectedService:{
        backgroundColor: "lightgreen"
    },
    serviceItem: {
        width: "100%",
        padding: 15
    }
})