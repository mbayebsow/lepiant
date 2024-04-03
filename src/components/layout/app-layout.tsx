import { Text, RefreshControl, View } from "react-native";
import { FC, ReactNode, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SharedValue } from "react-native-reanimated";
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollLargeHeaderProps,
  ScrollViewWithHeaders,
} from "@codeherence/react-native-header";
import ProfileIcon from "../profile/profile-icon";
import useStyles from "../../hook/useStyle";
import MiniPlayer from "../player/mini-player";
import useRadioStore from "../../hook/useRadio";
import useRevueStore from "../../hook/useRevue";
import useArticleStore from "../../hook/useArticle";
import useChannelStore from "../../hook/useChannel";
import useQuotidienStore from "../../hook/useQuotidien";

interface AppLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
  headerCenter?: ReactNode;
  noBottomBorder?: boolean;
  hideLargeHeader?: boolean;
  showHeaderCenter?: boolean;
  stickyHeaderIndices?: number[];
}

interface HeaderComponentProps {
  showNavBar: SharedValue<number>;
  noBottomBorder?: boolean;
  backgroundColor?: string;
  headerCenter?: ReactNode;
}

const HeaderComponent: FC<HeaderComponentProps> = ({
  showNavBar,
  noBottomBorder,
  backgroundColor,
  headerCenter,
}) => {
  const { backgroundColorLight, color } = useStyles();
  const route = useRoute();
  return (
    <Header
      noBottomBorder={noBottomBorder}
      borderColor={backgroundColorLight}
      borderWidth={1}
      headerStyle={{ backgroundColor }}
      showNavBar={showNavBar}
      // headerLeft={<Text>hideLargeHeader</Text>}
      headerCenter={
        headerCenter ? (
          headerCenter
        ) : (
          <Text style={{ fontSize: 16, fontWeight: "bold", color }}>{route.name}</Text>
        )
      }
      headerRight={<ProfileIcon />}
    />
  );
};

const LargeHeaderComponent = ({ scrollY }: ScrollLargeHeaderProps): ReactNode => {
  const route = useRoute();
  const { color } = useStyles();
  return (
    <LargeHeader>
      <ScalingView scrollY={scrollY}>
        <Text style={{ fontSize: 35, fontWeight: "bold", color }}>{route.name}</Text>
      </ScalingView>
    </LargeHeader>
  );
};

const AppLayout: FC<AppLayoutProps> = ({
  children,
  backgroundColor,
  headerCenter,
  noBottomBorder = false,
  hideLargeHeader = false,
  showHeaderCenter = false,
  stickyHeaderIndices,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const initRadios = useRadioStore((state) => state.initRadios);
  const initRevues = useRevueStore((state) => state.initRevues);
  const initArticles = useArticleStore((state) => state.initArticles);
  const initChannels = useChannelStore((state) => state.initChannels);
  const initQuotidiens = useQuotidienStore((state) => state.initQuotidiens);

  const initData = async () => {
    setRefreshing(true);
    await initRadios();
    await initRevues();
    await initArticles();
    await initChannels();
    await initQuotidiens();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollViewWithHeaders
        stickyHeaderIndices={stickyHeaderIndices}
        style={{ flex: 1, backgroundColor }}
        HeaderComponent={({ showNavBar }) => (
          <HeaderComponent
            showNavBar={showHeaderCenter ? 1 : showNavBar}
            noBottomBorder={noBottomBorder}
            backgroundColor={backgroundColor}
            headerCenter={headerCenter}
          />
        )}
        LargeHeaderComponent={hideLargeHeader ? undefined : LargeHeaderComponent}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor }}
            refreshing={refreshing}
            onRefresh={initData}
          />
        }
      >
        {children}
      </ScrollViewWithHeaders>
      <MiniPlayer />
    </View>
  );
};

export default AppLayout;
