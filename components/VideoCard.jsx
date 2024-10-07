import { useState, useEffect, useRef } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";

import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import { getCurrentUser, likeVideo, unlikeVideo } from "../lib/appWrite";

const VideoCard = ({
  title,
  creator,
  avatar,
  thumbnail,
  video,
  videoId,
  likeCounts,
  liked,
}) => {
  const [play, setPlay] = useState(false);
  const [likeVideoState, setLikeVideoState] = useState(liked);
  const [likeCount, setLikeCount] = useState(likeCounts);
  const { user, setUser } = useGlobalContext();

  const [volume, setVolume] = useState(1.0);
  const videoRef = useRef(null); // Create a ref for the Video component

  useEffect(() => {
    if (likeCounts !== undefined) {
      setLikeCount(likeCounts);
    }
  }, [likeCounts]);

  useEffect(() => {
    setLikeVideoState(liked);
  }, [liked]);

  const handleLikePress = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "You need to be logged in to like videos.");
        return;
      }

      if (likeVideoState) {
        await unlikeVideo(user.$id, videoId);
        setLikeVideoState(false);
        setLikeCount((prevCount) => Math.max(prevCount - 1, 0)); // Prevent negative counts
      } else {
        await likeVideo(user.$id, videoId);
        setLikeVideoState(true);
        setLikeCount((prevCount) => prevCount + 1);
      }

      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating like status:", error);
      Alert.alert("Error", "Something went wrong while updating like status.");
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setVolumeAsync(volume);
    }
  }, [volume]);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
          ref={videoRef} // Set the ref to the Video component
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleLikePress}
        className="absolute right-6 top-16 flex items-center"
      >
        <Image
          source={likeVideoState ? icons.like : icons.disLike}
          className="w-10 h-10"
          resizeMode="contain"
        />
        <Text className="text-white mt-1">
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;
