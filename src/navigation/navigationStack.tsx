import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DnsConnectionScreen from "@/screens/DnsConnectionScreen";
import CodesScanner from "@/screens/CodesScanner";
import {RecordsJson} from "@/functions/GetRecordByCode";
import RecordDetailsScreen from "@/screens/RecordDetailsScreen";

export type StackParams = {
    HomeScreen: undefined;
    DnsConnectionScreen: undefined;
    CodesScanner: undefined;
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
            <Stack.Screen name="CodesScanner" component={CodesScanner}
                          options={{headerShown: false}}
            />
            <Stack.Screen name="RecordDetailsScreen" component={RecordDetailsScreen}
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