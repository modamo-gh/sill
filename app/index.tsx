import { faker } from "@faker-js/faker";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMiles } from "~/contexts/MilesContext";

const Home = () => {
    const { miles } = useMiles();

    const [foodItems, setFoodItems] = useState<{ id: number; imageURL: any }[]>([]);

    useEffect(() => {
        const getRandomFoodImage = async () => {
            const response = await fetch("https://foodish-api.com/api/");
            const data = await response.json();

            return data.image;
        };

        const loadImages = async () => {
            const fi = await Promise.all(
                Array.from({ length: 20 }).map(async (_, index) => ({
                    id: index,
                    imageURL: await getRandomFoodImage(),
                }))
            );

            setFoodItems(fi);
        };

        loadImages();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false, title: "Home" }} />
            <SafeAreaView style={{ display: "flex", flex: 1, gap: 16, paddingHorizontal: 16 }}>
                <View className="flex flex-row gap-2">
                    <View className="flex h-12 flex-1 justify-center rounded-lg bg-white px-2">
                        <Text className="text-black/60">Search Food, Bakers and Cooks</Text>
                    </View>
                    <Pressable className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                        <Text>?</Text>
                    </Pressable>
                </View>
                <Text className="text-2xl font-semibold">
                    Available Within{" "}
                    <Link href="/map">
                        <Text className="underline">
                            {miles} mile{miles > 1 && "s"}
                        </Text>
                    </Link>
                </Text>
                <FlatList
                    className="w-full flex-1"
                    data={foodItems}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => (
                        <View
                            className="mb-4 flex flex-row items-center gap-2 rounded-lg bg-white p-4"
                            style={{ height: Dimensions.get("screen").height / 6 }}>
                            <View className="flex-shrink-0">
                                <Image
                                    className="h-[108px] w-[108px] rounded-lg"
                                    source={{ uri: item.imageURL }}
                                />
                            </View>
                            <View className="flex flex-1 gap-1 py-2">
                                <Text className="flex-1 text-base" numberOfLines={4}>
                                    {faker.food.description()}
                                </Text>
                                <Text className="text-2xl font-bold">
                                    ${String(Math.floor(Math.random() * 10))}.
                                    {String(Math.floor(Math.random() * 100)).padStart(2, "0")}
                                </Text>
                            </View>
                            <View className="flex h-full flex-shrink-0 items-center justify-around">
                                <Text>
                                    ⭐{" "}
                                    <Text className="font-semibold">
                                        {String(Math.floor(Math.random() * 5))}.
                                        {Math.floor(Math.random() * 10)} (
                                        {Math.floor(Math.random() * 10)}k+)
                                    </Text>
                                </Text>
                                <Pressable className="flex h-12 w-[72px] items-center justify-center rounded-2xl bg-purple-500">
                                    <Text className="text-2xl font-semibold text-white">+</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                    scrollEnabled
                />
            </SafeAreaView>
        </>
    );
};

export default Home;
