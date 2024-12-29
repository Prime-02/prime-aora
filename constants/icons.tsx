import { ImageSourcePropType } from "react-native";

// Importing the icons
import bookmark from "../assets/icons/bookmark.png";
import home from "../assets/icons/home.png";
import plus from "../assets/icons/plus.png";
import profile from "../assets/icons/profile.png";
import leftArrow from "../assets/icons/left-arrow.png";
import menu from "../assets/icons/menu.png";
import search from "../assets/icons/search.png";
import upload from "../assets/icons/upload.png";
import rightArrow from "../assets/icons/right-arrow.png";
import logout from "../assets/icons/logout.png";
import eyeHide from "../assets/icons/eye-hide.png";
import eye from "../assets/icons/eye.png";
import play from "../assets/icons/play.png";

// Define the type for the icons
type IconSet = {
  play: ImageSourcePropType;
  bookmark: ImageSourcePropType;
  home: ImageSourcePropType;
  plus: ImageSourcePropType;
  profile: ImageSourcePropType;
  leftArrow: ImageSourcePropType;
  menu: ImageSourcePropType;
  search: ImageSourcePropType;
  upload: ImageSourcePropType;
  rightArrow: ImageSourcePropType;
  logout: ImageSourcePropType;
  eyeHide: ImageSourcePropType;
  eye: ImageSourcePropType;
};

// Explicitly cast imported images as `ImageSourcePropType`
const icons: IconSet = {
  play: play as ImageSourcePropType,
  bookmark: bookmark as ImageSourcePropType,
  home: home as ImageSourcePropType,
  plus: plus as ImageSourcePropType,
  profile: profile as ImageSourcePropType,
  leftArrow: leftArrow as ImageSourcePropType,
  menu: menu as ImageSourcePropType,
  search: search as ImageSourcePropType,
  upload: upload as ImageSourcePropType,
  rightArrow: rightArrow as ImageSourcePropType,
  logout: logout as ImageSourcePropType,
  eyeHide: eyeHide as ImageSourcePropType,
  eye: eye as ImageSourcePropType,
};

export default icons;
