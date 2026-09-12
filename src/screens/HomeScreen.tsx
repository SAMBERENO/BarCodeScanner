import {Pressable, StyleSheet, Text, View} from "react-native";
import {styles} from '@/styles'
import {StackParams} from "@/navigation/navigationStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import { createLists } from "@/functions/CreateLists";
import {addPdfRecords} from "@/functions/AddPdfRecords";

type Props = NativeStackScreenProps<StackParams, "HomeScreen">;

export default function HomeScreen({ navigation }: Props){
 return (
   <View style={styles.mainContainer}>
       <View style={styles.headerContainer}>
        <Text style={styles.headerVersion}>
            1.1
        </Text>
           <Pressable onPress={() => navigation.navigate("DnsConnectionScreen")}>
               <View style={localStyles.statusContainer}>
                   <Text style={styles.headerDeffText}>
                       Host PC
                   </Text>
                   <Text style={styles.headerStatus}/>
               </View>
           </Pressable>
        </View>
       <View style={styles.middleContainer}>
           <Pressable onPress={() => navigation.navigate("BarCodesScanner")}>
               <View style={styles.middleRoundedRectangle}>
                   <Text style={styles.middleButtons}>
                       Skan kodu kreskowego
                   </Text>
               </View>
           </Pressable>
           <Pressable>
               <View style={styles.middleRoundedRectangle}>
                   <Text style={styles.middleButtons}>
                       Wybór pozycji z bazy danych
                   </Text>
               </View>
           </Pressable>
               <View style={styles.middleRoundedRectangle}>
                   <Pressable onPress={async () => {
                       await addPdfRecords();}}>
                   <Text style={styles.middleButtons}>
                       Dodanie pozycji z PDF
                   </Text>
           </Pressable>
       </View>
           <Pressable onPress={() => navigation.navigate("QrScannerScreen")}>
               <View style={styles.middleRoundedRectangle}>
                   <Text style={styles.middleButtons}>
                       Skan kodu QR
                   </Text>
               </View>
           </Pressable>
       </View>
       <View style={styles.footerContainer}>
           <View style={styles.footerRoundedRectangle}>
               <Text style={styles.footerButtons}>
                   Zawartość bazy danych
               </Text>
           </View>
            <View style={styles.footerRoundedRectangle}>
                <Pressable onPress={async () => {
                    await createLists();}}>
                <Text style={styles.footerButtons}>
                    Utworzenie Excela
                </Text>
                </Pressable>
            </View>
       </View>
   </View>
 );
}

const localStyles = StyleSheet.create({
    statusContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
})

