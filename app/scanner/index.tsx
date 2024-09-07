import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
    AppState,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home() {
    const [isCameraActive, setIsCameraActive] = useState(true); // Camera visibility state
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZmQ2ZTczNy0zZTg5LTQ5MDUtOTM0My0yZmRjMWI4MGI1NGQiLCJlbWFpbCI6Im1lc3NNYW5hZ2VyQGdtYWlsLmNvbSIsInJvbGVzIjpbIm1lc3NNYW5hZ2VyIl0sImlhdCI6MTcyNTY2OTIzNX0.V9Ur8kCnFtQLvq1_AhTNfHJl6_GF1MVXdYOko9g5ae8";

    const availMeal = async (data: any) => {
        try {
            console.log(data);
            const response = await axios.get(data, {
                headers: { Authorization: "Bearer " + token },
            });
            console.log(response.status);
            alert("Meal availed successfully!!!", () => {
                setIsCameraActive(false); // Close the camera when the alert is dismissed
            });
        } catch (error) {
            alert("Meal availed successfully", () => {
                setIsCameraActive(false); // Close the camera when the alert is dismissed
            });
            console.log(error);
        }
    };

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    qrLock.current = false;
                    setIsCameraActive(true); // Reactivate camera when app comes to the foreground
                }
                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
                options={{
                    title: "Overview",
                    headerShown: false,
                }}
            />
            {Platform.OS === "android" ? <StatusBar hidden /> : null}

            {/* Conditionally render the CameraView */}
            {isCameraActive && (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true;
                            setTimeout(async () => {
                                // await Linking.openURL(data);
                                await availMeal(data);
                            }, 500);
                        }
                    }}
                />
            )}

            <Overlay />
        </SafeAreaView>
    );
}
