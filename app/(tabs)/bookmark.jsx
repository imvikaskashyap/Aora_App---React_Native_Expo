import {
  View,
  Text,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
// import SearchInput from "../../components/SearchInput";
import TrendingVideos from "../../components/TrendingVideos";
import EmptyState from "../../components/EmptyState";
import { getAllVideos, getLatestVideos } from "../../lib/appWrite";
import useAppWrite from "../../lib/useAppWrite";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: videos } = useAppWrite(getAllVideos);
  const { data: latestVideos,refetch } = useAppWrite(getLatestVideos);

  const [refreshing, setRefreshing] = useState(false);

  // console.log("User likes====>", user)

  const onRefresh = async () => {
    setRefreshing(true);

    // re call videos => if any new  videos added
    await refetch();

    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
        <FlatList
        data={user.likedVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          const latestVideo = latestVideos.find(video => video.$id === item.$id);
          const likeCounts = latestVideo ? latestVideo.likes.length : 0;

          const liked = user?.likedVideos?.some((likedVideo) => likedVideo.$id === item.$id);

          return (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              user={item.user}
              videoId={item.$id}
              likeCounts={likeCounts} 
              liked={liked} // Pass the like state to VideoCard
            />
          );
        }}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-medium text-2xl text-white">
                  Liked Videos
                </Text>
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


export default Bookmark