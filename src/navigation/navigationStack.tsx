import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DnsConnectionScreen from "@/screens/DnsConnectionScreen";
import BarCodesScanner from "@/screens/BarCodesScanner";
import {RecordsJson} from "@/functions/GetRecordByCode";
import RecordDetailsScreen from "@/screens/RecordDetailsScreen";
import QrScannerScreen from "@/screens/QrScannerScreen";

export type StackParams = {
    HomeScreen: undefined;
    DnsConnectionScreen: undefined;
    BarCodesScanner: undefined;
    QrScannerScreen: undefined;
    RecordDetailsScreen: {
        record: RecordsJson;
    };
}

const Stack = createNativeStackNavigator<StackParams>();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName={"HomeScreen"}>
            <Stack.Screen name="HomeScreen" component={HomeScreen}
                          options={{headerShown: false}}
            />
            <Stack.Screen name="DnsConnectionScreen" component={DnsConnectionScreen}
                          options={{headerShown: false}}
            />
            <Stack.Screen name="BarCodesScanner" component={BarCodesScanner}
                          options={{headerShown: false}}
            />
            <Stack.Screen name="RecordDetailsScreen" component={RecordDetailsScreen}
                          options={{headerShown: false}}
            />
            <Stack.Screen name="QrScannerScreen" component={QrScannerScreen}
                          options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
}
export default function CreateAppStackNavigator() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    )
}