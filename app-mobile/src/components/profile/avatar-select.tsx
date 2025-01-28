import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import avatars from "../../utils/avatar.json";
import useStyles from "../../hook/useStyle";
import Image from "../ui/image";

interface AvatarSelectProps {
  avatar: string | undefined;
  setAvatar: (avatar: string) => void;
}

const AvatarSelect: FC<AvatarSelectProps> = ({ avatar, setAvatar }) => {
  const { backgroundColor, primaryColor } = useStyles();
  return (
    <View style={styles.avatarContainer}>
      <FlatList
        data={avatars}
        numColumns={3}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              padding: 5,
              width: "33%",
              height: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Pressable
              onPress={() => setAvatar(item.uri)}
              style={{
                flex: 1,
                width: 100,
                height: 100,
                backgroundColor: backgroundColor,
                borderWidth: avatar === item.uri ? 2 : 0,
                borderColor: primaryColor,
                padding: 10,
                borderRadius: 100,
                aspectRatio: 1,
              }}>
              <View style={{ width: "100%", height: "100%" }}>
                <Image src={item.uri} />
              </View>
            </Pressable>
          </View>
        )}
        //keyExtractor={({index})}
      />
    </View>
  );
};

export default AvatarSelect;

const styles = StyleSheet.create({
  avatarContainer: {
    // flex: 1,
    height: 300,
  },
});
