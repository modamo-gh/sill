import { Slider } from "@miblanchard/react-native-slider";
import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMiles } from "~/contexts/MilesContext";

const Map = () => {
    const { miles, setMiles } = useMiles();

    const ref = useRef<MapView>(null);

    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [errorMessage, setErrorMessage] = useState<null | string>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setErrorMessage("Permission to access location was denied");

                return;
            }

            let l = await Location.getCurrentPositionAsync();

            setLocation(l);
        })();
    }, []);

    if (!location) {
        return <View style={{ flex: 1 }} />;
    }

    const handleMileChange = (m: number) => {
        setMiles(m);

        ref?.current?.animateToRegion(
            {
                latitude: location.coords.latitude,
                latitudeDelta: 0.05 * m,
                longitude: location.coords.longitude,
                longitudeDelta: 0.05 * m,
            },
            1000
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false, title: "Map" }} />
            <MapView
                initialRegion={{
                    latitude: location.coords.latitude,
                    latitudeDelta: 0.05,
                    longitude: location.coords.longitude,
                    longitudeDelta: 0.05,
                }}
                ref={ref}
                showsMyLocationButton
                showsUserLocation
                style={{ flex: 1 }}>
                <View
                    className="absolute flex-row items-center bg-transparent p-4"
                    style={{ top: insets.top }}>
                    <Pressable
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80"
                        onPress={() => router.back()}>
                        <Text className="text-2xl font-bold">{"<"}</Text>
                    </Pressable>
                </View>
                <Circle
                    center={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    fillColor="rgba(100, 200, 100, 0.1)"
                    radius={miles * 1609.344}
                    strokeColor="rgba(100, 200, 100, 0.5)"
                    strokeWidth={2}
                />
            </MapView>
            <View className="absolute right-0 bottom-0 left-0 z-10 m-2 flex h-1/10 flex-col items-center justify-center rounded-3xl bg-white/80 px-6">
                <Slider
                    onValueChange={(m) => {
                        const value = Array.isArray(m) ? m[0] : m;

                        handleMileChange(value);
                    }}
                    value={miles}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    trackClickable={true}
                    containerStyle={{ width: "100%" }}
                />
                <Text className="text-2xl">
                    {miles} mile{miles > 1 && "s"}
                </Text>
            </View>
        </>
    );
};

export default Map;
