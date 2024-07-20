import { useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function useStyles() {
  const isDarkMode = useColorScheme() === "dark";

  let primaryColor = "#dc0000";
  let primaryColor90 = "#ec5032";
  let primaryColor80 = "#f26648";
  let primaryColor70 = "#f87b5d";
  let primaryColor60 = "#fd8e73";
  let primaryColor50 = "#ffa189";
  let primaryColor40 = "#ffb4a0";
  let primaryColor30 = "#ffc7b7";
  let primaryColor20 = "#ffdacf";
  let primaryColor10 = "#ffece7";

  let secondaryColor = "#FF7A00";

  let color: string = isDarkMode ? Colors.white : Colors.black;
  let colorLight: string = isDarkMode ? "#C2C2C2" : "#949494";
  let borderColor: string = isDarkMode ? "#363636" : "#e3e3e3";
  let inputBackground: string = isDarkMode ? Colors.dark : "#e3e3e3";
  let backgroundColor: string = isDarkMode ? "#171717" : Colors.white;
  let backgroundColorLight: string = isDarkMode ? "#232323" : "#F2F2F7";

  const inputStyle = {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: inputBackground,
    color,
    marginBottom: 15,
  };

  return {
    primaryColor,
    primaryColor90,
    primaryColor80,
    primaryColor70,
    primaryColor60,
    primaryColor50,
    primaryColor40,
    primaryColor30,
    primaryColor20,
    primaryColor10,
    secondaryColor,
    color,
    colorLight,
    borderColor,
    backgroundColor,
    backgroundColorLight,
    inputStyle,
    isDarkMode,
    inputBackground,
  };
}
