// Define the type for the images
type ImageSet = {
  profile: any;
  thumbnail: any;
  cards: any;
  path: any;
  logo: any;
  logoSmall: any;
  empty: any;
};

// Export the images as a default object of the defined type
const images: ImageSet = {
  profile: require("../assets/images/profile.png"),
  thumbnail: require("../assets/images/thumbnail.png"),
  cards: require("../assets/images/cards.png"),
  path: require("../assets/images/path.png"),
  logo: require("../assets/images/logo.png"),
  logoSmall: require("../assets/images/logo-small.png"),
  empty: require("../assets/images/empty.png"),
};

export default images;
