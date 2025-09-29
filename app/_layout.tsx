import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { Stack } from "expo-router";
import { MilesProvider } from "~/contexts/MilesContext";

export default function Layout() {
    return (
        <SafeAreaProvider>
            <MilesProvider initialValue={1}>
                <Stack />
            </MilesProvider>
        </SafeAreaProvider>
    );
}
