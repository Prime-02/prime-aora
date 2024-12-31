import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { EmptyState, InfoBox, VideoCard } from "@/components";
import { router, useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
  
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

   const onRefresh = async () => {
     setRefreshing(true);
     await refetch();
     setRefreshing(false);
   };

  const logOut = async() => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace(`/signIn`)
  };

  return (
    <SafeAreaView className="h-full bg-primary pt-12">
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            avatar={item.users.avatar}
            creator={item.users.username}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logOut}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary-200 rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              subtitle=""
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Videos Found"
            subtitle={`You haven't posted any videos yet`}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
