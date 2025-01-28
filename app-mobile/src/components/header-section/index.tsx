import { View, Text, StyleSheet, Pressable } from "react-native";
import useStyles from "../../hook/useStyle";
import { FC } from "react";
import { ChevronRight } from "lucide-react-native";

interface HeaderSectionProps {
  title: string;
  span?: string;
  onPress?: () => void;
}

const HeaderSection: FC<HeaderSectionProps> = ({ title, span, onPress }) => {
  const { color, colorLight } = useStyles();
  return (
    <View style={styles.container}>
      <Pressable style={styles.titleContainer} onPress={onPress}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        {onPress && <ChevronRight size={15} color={colorLight} />}
      </Pressable>
      <Text style={[styles.span, { color: colorLight }]}>{span}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    paddingBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
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
