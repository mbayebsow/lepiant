import { View, Text, RefreshControl } from "react-native";
import MiniPlayer from "../player/MiniPlayer";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";

import { Header, LargeHeader, ScalingView, ScrollViewWithHeaders } from '@codeherence/react-native-header';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileIcon from "../user/profile/ProfileIcon";
import useStyles from "../../hook/useStyle";



export default function TabLayout({ children, backgroundColor, headerCenter, noBottomBorder, hideLargeHeader }) {
  const { color } = useStyles()
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  // const { bottom } = useSafeAreaInsets();


  const HeaderComponent = ({ showNavBar }) => (
    <Header
      noBottomBorder={noBottomBorder}
      borderWidth={0}
      headerStyle={{ backgroundColor }}
      showNavBar={hideLargeHeader ? 1 : showNavBar}
      headerCenter={headerCenter ? headerCenter : <Text style={{ fontSize: 16, fontWeight: 'bold', color }}>{route.name}</Text>}
      headerRight={<ProfileIcon />}

    />
  )


  const LargeHeaderComponent = ({ scrollY }) => (
    <LargeHeader>
      <ScalingView scrollY={scrollY}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color }}>{route.name}</Text>

      </ScalingView>
    </LargeHeader>
  )

  return (
    <ScrollViewWithHeaders
      style={{ backgroundColor }}
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={hideLargeHeader ? null : LargeHeaderComponent}
      refreshControl={
        <RefreshControl
          style={{ backgroundColor }}
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
      <MiniPlayer />
    </ScrollViewWithHeaders>
  );
}
