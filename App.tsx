import { faker } from "@faker-js/faker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	Pressable,
	Text,
	View
} from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

type MODE = "WALK" | "BIKE" | "DRIVE";

const App = () => {
	const ref = useRef<MapView>(null);

	const [foodItems, setFoodItems] = useState<{ id: number; imageURL: any }[]>(
		[]
	);
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

	useEffect(() => {
		const loadImages = async () => {
			const fi = await Promise.all(
				Array.from({ length: 20 }).map(async (_, index) => ({
					id: index,
					imageURL: await getRandomFoodImage()
				}))
			);

			setFoodItems(fi);
		};

		loadImages();
	}, []);

	if (!location) {
		return <View style={{ flex: 1 }} />;
	}

	// const getDelta = (m: MODE) => {
	// 	switch (m) {
	// 		case "WALK":
	// 			return 0.05;
	// 		case "BIKE":
	// 			return 0.15;
	// 		case "DRIVE":
	// 			return 0.375;
	// 	}
	// };

	// const getRadius = () => {
	// 	switch (mode) {
	// 		case "WALK":
	// 			return 2000;
	// 		case "BIKE":
	// 			return 6000;
	// 		case "DRIVE":
	// 			return 15000;
	// 	}
	// };

	// const handleModeChange = (m: MODE) => {
	// 	setMode(m);

	// 	ref?.current?.animateToRegion(
	// 		{
	// 			latitude: location.coords.latitude,
	// 			latitudeDelta: getDelta(m),
	// 			longitude: location.coords.longitude,
	// 			longitudeDelta: getDelta(m)
	// 		},
	// 		1000
	// 	);
	// };

	const getRandomFoodImage = async () => {
		const response = await fetch("https://foodish-api.com/api/");
		const data = await response.json();

		return data.image;
	};

	return (
		<SafeAreaView
			className="bg-gray-100 flex gap-4 h-screen justify-center px-4"
			edges={["top"]}
		>
			<View className="flex flex-row gap-2">
				<View className="bg-white flex flex-1 h-12 justify-center rounded-lg px-2">
					<Text className="text-black/60">
						Search Food, Bakers and Cooks
					</Text>
				</View>
				<Pressable className="bg-white flex items-center justify-center h-12 w-12 rounded-full">
					<Text>?</Text>
				</Pressable>
			</View>
			<Text className="font-semibold text-2xl ">
				Available Within <Text className="underline">3 miles</Text>
			</Text>
			<FlatList
				className="flex-1 w-full"
				data={foodItems}
				keyExtractor={(item) => `${item.id}`}
				renderItem={({ item }) => (
					<View
						className="bg-white flex flex-row gap-2 items-center mb-4 p-4 rounded-lg"
						style={{ height: Dimensions.get("screen").height / 6 }}
					>
						<View className="flex-shrink-0">
							<Image
								className="h-[108px] rounded-lg w-[108px]"
								source={{ uri: item.imageURL }}
							/>
						</View>
						<View className="gap-1 flex flex-1 py-2">
							<Text
								className="flex-1 text-base"
								numberOfLines={4}
							>
								{faker.food.description()}
							</Text>
							<Text className="font-bold text-2xl">
								${String(Math.floor(Math.random() * 10))}.
								{String(
									Math.floor(Math.random() * 100)
								).padStart(2, "0")}
							</Text>
						</View>
						<View className="flex flex-shrink-0 h-full items-center justify-around">
							<Text>
								⭐{" "}
								<Text className="font-semibold">
									{String(Math.floor(Math.random() * 5))}.
									{Math.floor(Math.random() * 10)} (
									{Math.floor(Math.random() * 10)}k+)
								</Text>
							</Text>
							<Pressable className="bg-purple-500 flex h-12 items-center justify-center rounded-2xl w-[72px]">
								<Text className="font-semibold text-white text-2xl">
									+
								</Text>
							</Pressable>
						</View>
					</View>
				)}
				scrollEnabled
			/>
			{/* <MapView
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
			</View> */}
		</SafeAreaView>
	);
};

export default App;
