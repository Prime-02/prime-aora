import React from "react";
import { View, Text } from "react-native";

type InfoBoxProps = {
  title: string;
  subtitle: string;
  containerStyles?: string; // Optional Tailwind classes or custom styles
  titleStyles?: string; // Optional Tailwind classes or custom styles
};

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  subtitle,
  containerStyles = "",
  titleStyles = "",
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
