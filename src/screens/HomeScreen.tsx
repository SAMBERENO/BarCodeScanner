import {Pressable, StyleSheet, Text, View} from "react-native";
import {styles} from '@/styles'
import {StackParams} from "@/navigation/navigationStack";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import { createLists } from "@/functions/CreateLists";

type Props = NativeStackScreenProps<StackParams, "HomeScreen">;

export default function HomeScreen({ navigation }: Props){
 return (
   <View style={styles.mainContainer}>
       <View style={styles.headerContainer}>
        <Text style={styles.headerVersion}>
            2137.69
        </Text>
           <Pressable onPress={() => navigation.navigate("DnsConnectionScreen")}>
               <View style={localStyles.statusContainer}>
                   <Text style={styles.headerDeffText}>
                       PC of death
                   </Text>
                   <Text style={styles.headerStatus}/>
               </View>
           </Pressable>
        </View>
       <View style={styles.middleContainer}>
           <Pressable onPress={() => navigation.navigate("CodesScanner")}>
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
           <Pressable>
               <View style={styles.middleRoundedRectangle}>
                   <Text style={styles.middleButtons}>
                       Wybór zdjęcia z biblioteki do skanu
                   </Text>
               </View>
           </Pressable>
           <Pressable>
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
                <Pressable onPress={async () => { try {
                    await createLists();
                    console.log("createLists wykonane poprawnie");
                } catch (error) {
                    console.log("Błąd:", error);
                }}}>
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

