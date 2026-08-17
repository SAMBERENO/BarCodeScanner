import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#86C8E5",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "12%"
    },
    headerDeffText:{
        fontWeight: "bold",
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontSize: 20
    },
    headerStatus:{
        borderRadius: 20,
        borderWidth: 1,
        width: 30,
        height: 30,
        backgroundColor: "red",
    },
    headerVersion:{
        fontWeight: "bold",
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontSize: 10
    },
    middleContainer:{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "66%"
    },
    middleRoundedRectangle:{
        borderRadius: 5,
        borderWidth: 2,
        minHeight: "15%",
        width: "80%",
        minWidth: "80%",
        justifyContent: "center",
        backgroundColor: "white",
    },
    middleButtons:{
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center"
    },
    footerContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "22%"
    },
    footerRoundedRectangle:{
        borderRadius: 5,
        borderWidth: 2,
        height: "50%",
        width: "40%",
        minWidth: "40%",
        justifyContent: "center",
        backgroundColor: "white",
    },
    footerButtons:{
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    },
    footerGoBackContainer:{
        alignItems: "center",
        height: "10.5%"
    },
    footerGoBackRectangle:{
        borderRadius: 5,
        borderWidth: 2,
        height: "100%",
        minWidth: "100%",
        justifyContent: "center",
        backgroundColor: "white",
    }
});