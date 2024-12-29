import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ListRenderItemInfo,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { VideoView, useVideoPlayer } from "expo-video"; // Import from expo-video

// Corrected animation definitions
const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1.2 },
};

const zoomOut = {
  0: { scale: 1.2 },
  1: { scale: 0.9 },
};

// TrendingItem component
type TrendingItemProps = {
  activeItem: LatestPost | null;
  item: LatestPost;
};

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  // Initialize video player using useVideoPlayer
  const player = useVideoPlayer(item.video, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem?.$id === item.$id ? zoomIn : zoomOut} // Compare by ID
      duration={500}
    >
      {play ? (
        <VideoView
          style={{
            width: "100%",
            height: 240,
            borderRadius: 16,
            marginTop: 12,
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
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
  posts: LatestPost[]; // Use LatestPost instead of Post
};

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<LatestPost | null>(posts[0]);

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
          item={item} // Pass the single item, not the whole posts array
        />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
    />
  );
};

export default Trending;
