import React from "react";
import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";

type EmptyStateProps = {
  title: string;
  subtitle: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <Text className="text-xl font-psemibold text-white mt-2">{title}</Text>
      <Text className="text-sm text-center font-pmedium text-gray-100 ">
        {subtitle}
      </Text>

      <CustomButton
        title="Create Video"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
