import {Pressable, Text, View} from "react-native";
import {styles} from '@/styles'
import ShowWiFiConnection from '@/functions/ShowWiFiConnection'
import LfDnsConnection from "@/functions/LfDnsConnections";

export default function DnsConnectionScreen({navigation} : any) {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.headerVersion}>
                    <Text style={styles.headerDeffText}>
                        Znalezione urządzenia w sieci:
                        <ShowWiFiConnection/>
                    </Text>
                </View>
            </View>
            <LfDnsConnection/>
            <View style={styles.footerGoBackContainer}>
                <Pressable onPress={() => {navigation.goBack()}}>
                    <View style={styles.footerGoBackRectangle}>
                        <Text style={styles.footerButtons}>
                            Powrót
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}
