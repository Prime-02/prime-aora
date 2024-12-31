import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ListRenderItemInfo,
  Button,
  Text,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import VideoScreen from "@/components/video";

// Corrected animation definitions
const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1 },
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.9 },
};

// TrendingItem component
type TrendingItemProps = {
  activeItem: LatestPost | null;
  item: LatestPost;
  play: string | null;
  setPlay: (value: string | null) => void;
};

const TrendingItem: React.FC<TrendingItemProps> = ({
  activeItem,
  item,
  play,
  setPlay,
}) => {
  return (
    <Animatable.View
      className="mr-1"
      animation={activeItem?.$id === item.$id ? zoomIn : zoomOut} // Compare by ID
      duration={500}
    >
      {play === item?.$id ? (
        <View className="relative">
          <VideoScreen
            url={item.video}
            containerStyle="w-52 overflow-hidden  h-72 rounded-[33px]  bg-white/10"
          />
          <Text
            className="absolute left-4 top-2 text-white px-2 text-xs py-1 border-secondary-100 border rounded-full"
            onPress={() => setPlay(null)}
          >
            X
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(item?.$id)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-3xl my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

// Adjusted LatestPost type for Trending
type LatestPost = {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  users: {
    username: string;
    avatar: string;
  };
};

type TrendingProps = {
  posts: LatestPost[];
};

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<LatestPost | null>(posts[0]);
  const [play, setPlay] = useState<string | null>(null); // Moved play state here

  // Correct typing for viewableItemsChanged
  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ key: string }>;
  }) => {
    if (viewableItems.length > 0) {
      const activePost = posts.find(
        (item) => item.$id === viewableItems[0].key
      );
      if (activePost) setActiveItem(activePost);

    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id} // Use $id from LatestPost
      renderItem={({ item }: ListRenderItemInfo<LatestPost>) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
          play={play} // Pass play state
          setPlay={setPlay} // Pass setPlay function
        />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      // scrollEnabled={play === null} // Disable scrolling if a video is playing
    />
  );
};

export default Trending;
