import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Circle } from "react-native-maps";

type MODE = "WALK" | "BIKE" | "DRIVE";

const App = () => {
	const ref = useRef<MapView>(null);

	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	);
	const [mode, setMode] = useState<MODE>("WALK");
	const [errorMessage, setErrorMessage] = useState<null | string>(null);

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

	const getDelta = (m: MODE) => {
		switch (m) {
			case "WALK":
				return 0.05;
			case "BIKE":
				return 0.15;
			case "DRIVE":
				return 0.375;
		}
	};

	const getRadius = () => {
		switch (mode) {
			case "WALK":
				return 2000;
			case "BIKE":
				return 6000;
			case "DRIVE":
				return 15000;
		}
	};

	const handleModeChange = (m: MODE) => {
		setMode(m);

		ref?.current?.animateToRegion(
			{
				latitude: location.coords.latitude,
				latitudeDelta: getDelta(m),
				longitude: location.coords.longitude,
				longitudeDelta: getDelta(m)
			},
			1000
		);
	};

	return (
		<View style={{ display: "flex", flex: 1, position: "relative" }}>
			<MapView
				initialRegion={{
					latitude: location.coords.latitude,
					latitudeDelta: getDelta("WALK"),
					longitude: location.coords.longitude,
					longitudeDelta: getDelta("WALK")
				}}
				ref={ref}
				showsMyLocationButton
				showsUserLocation
				style={{ flex: 1 }}
			>
				<Circle
					center={{
						latitude: location.coords.latitude,
						longitude: location.coords.longitude
					}}
					fillColor="rgba(100, 200, 100, 0.1)"
					radius={getRadius()}
					strokeColor="rgba(100, 200, 100, 0.5)"
					strokeWidth={2}
				/>
			</MapView>
			<View
				style={{
					backgroundColor: "rgba(255, 255, 255, 0.8)",
					borderRadius: 25,
					bottom: 0,
					display: "flex",
					flexDirection: "row",
					gap: 8,
					height: "10%",
					left: 0,
					margin: 8,
					padding: 8,
					position: "absolute",
					right: 0,
					zIndex: 10
				}}
			>
				<Pressable
					onPress={() => handleModeChange("WALK")}
					style={{
						backgroundColor:
							mode === "WALK" ? "rgba(255, 255, 255)" : undefined,
						borderRadius: 25,
						alignItems: "center",
						flex: 1,
						justifyContent: "center"
					}}
				>
					<Text style={{ fontSize: 28 }}>👣</Text>
				</Pressable>
				<Pressable
					onPress={() => handleModeChange("BIKE")}
					style={{
						backgroundColor:
							mode === "BIKE" ? "rgba(255, 255, 255)" : undefined,
						borderRadius: 25,
						alignItems: "center",
						flex: 1,
						justifyContent: "center"
					}}
				>
					<Text style={{ fontSize: 28 }}>🚲</Text>
				</Pressable>
				<Pressable
					onPress={() => handleModeChange("DRIVE")}
					style={{
						backgroundColor:
							mode === "DRIVE"
								? "rgba(255, 255, 255)"
								: undefined,
						borderRadius: 25,
						alignItems: "center",
						flex: 1,
						justifyContent: "center"
					}}
				>
					<Text style={{ fontSize: 28 }}>🚗</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default App;
