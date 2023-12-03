import { View, ScrollView, RefreshControl } from "react-native";
import MiniPlayer from "../player/MiniPlayer";
import { useState } from "react";

export default function TabLayout({ children, backgroundColor }) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: backgroundColor }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 5000);
            }}
          />
        }
      >
        {children}
      </ScrollView>
      <MiniPlayer />
    </View>
  );
}
