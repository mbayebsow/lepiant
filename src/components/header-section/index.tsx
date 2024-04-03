import { View, Text, StyleSheet } from "react-native";
import useStyles from "../../hook/useStyle";
import { FC } from "react";

interface HeaderSectionProps {
  title: string;
  span: string;
}

const HeaderSection: FC<HeaderSectionProps> = ({ title, span }) => {
  const { color, colorLight } = useStyles();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{title}</Text>
      <Text style={[styles.span, { color: colorLight }]}>{span}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    paddingBottom: 8,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  span: {
    fontSize: 12,
  },
});

export default HeaderSection;
