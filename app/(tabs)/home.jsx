import { View, Text, FlatList, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import TrendingVideos from "../../components/TrendingVideos";
import EmptyState from "../../components/EmptyState";
import RefreshControl from "../../components/RefreshControl";
import { getAllPosts } from "../../lib/appWrite";
import useAppWrite from "../../lib/useAppWrite";

const Home = () => {

    const {data:posts, isLoading, reFetch} = useAppWrite(getAllPosts)

  const [refreshing, setRefreshing] = useState(false);
 

  console.log("posts====>", posts)


  const onRefresh = async () => {
    setRefreshing(true);

    // re call videos => if any new  videos added
   await reFetch()

    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={[{ id: 1 }]}
        data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <Text className="text-white">{item.id}</Text>}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-medium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl text-white font-psemibold">John</Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <TrendingVideos posts={[{ id: 1 }, { id: 2 }, { id: 3 }] ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
