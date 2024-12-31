import React from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Text, StyleSheet, Image } from "react-native";
import { icons } from "@/constants";

type MenuOptionItem = {
  label: string; // Text to display
  onSelect: () => void; // Function to call when selected
  disabled?: boolean; // Whether the option is disabled
  textStyle?: object; // Optional custom text styles
};

type PopupMenuProps = {
  triggerText: string; // Text for the menu trigger
  options: MenuOptionItem[]; // Array of menu options
  triggerTextStyle?: object; // Optional styles for the trigger text
};

const PopupMenu: React.FC<PopupMenuProps> = ({
  options,
}) => {
  return (
    <Menu>
      <MenuTrigger>
        <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
      </MenuTrigger>
      <MenuOptions>
        {options.map((option, index) => (
          <MenuOption
            key={index}
            onSelect={option.onSelect}
            disabled={option.disabled}
          >
            <Text
              style={[
                styles.menuOptionText,
                option.disabled && styles.disabledText,
                option.textStyle,
              ]}
            >
              {option.label}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  triggerText: {
    
  },
  menuOptionText: {
   
  },
  disabledText: {
  },
});

export default PopupMenu;
