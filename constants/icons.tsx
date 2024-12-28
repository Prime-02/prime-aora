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
  play: string;
  bookmark: string;
  home: string;
  plus: string;
  profile: string;
  leftArrow: string;
  menu: string;
  search: string;
  upload: string;
  rightArrow: string;
  logout: string;
  eyeHide: string;
  eye: string;
};

// Export the icons as a default object of the defined type
const icons: IconSet = {
  play,
  bookmark,
  home,
  plus,
  profile,
  leftArrow,
  menu,
  search,
  upload,
  rightArrow,
  logout,
  eyeHide,
  eye,
};

export default icons;
