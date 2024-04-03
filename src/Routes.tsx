import { View } from "react-native";
import { Newspaper, BoomBox, Library, X, ChevronLeft } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import NewsScreen from "./screens/news-screen";
import QuotidienScreen from "./screens/quotidien-screen";
import RadioScreen from "./screens/radio-screen";
import ProfileScreen from "./screens/profile-screen";
import LibraryScreen from "./screens/library-screen";
import PlayerScreen from "./screens/player-screen";
import ArticleScreen from "./screens/article-screen";
import ChannelsScreen from "./screens/channels-screen";
import ProfileEditScreen from "./screens/ProfileEdit.screen";
import ShareArticleScreen from "./screens/share-article-screen";
import LoginScreen from "./screens/login-screen";
import ChannelScreen from "./screens/channel-screen";

import useStyles from "./hook/useStyle";
import BackButton from "./components/back-button";

const TabStack = createBottomTabNavigator();
const RootStack = createStackNavigator();

const TabNavigation = () => {
  const { backgroundColor, primaryColor, colorLight } = useStyles();
  return (
    <TabStack.Navigator
      screenOptions={() => ({
        swipeEnabled: true,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: colorLight,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor,
          paddingVertical: 5,
          // height: 90,
        },
        headerShown: false,
      })}
    >
      <TabStack.Screen
        name="Actualités"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} />,
        }}
      />
      <TabStack.Screen
        options={{
          tabBarIcon: ({ color, size }) => <BoomBox color={color} size={size} />,
        }}
        name="Radios"
        component={RadioScreen}
      />
      <TabStack.Screen
        options={{
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
        name="Bibliothèque"
        component={LibraryScreen}
      />
    </TabStack.Navigator>
  );
};

const Routes = () => {
  const { backgroundColor, backgroundColorLight, primaryColor, color, colorLight, primaryColor10 } =
    useStyles();

  const Theme = {
    dark: true,
    colors: {
      primary: primaryColor,
      background: backgroundColor,
      card: backgroundColorLight,
      text: color,
      border: colorLight,
      notification: primaryColor,
    },
  };

  return (
    <NavigationContainer theme={Theme}>
      <RootStack.Navigator
        screenOptions={() => ({
          headerTitle: "",
          headerBackTitleVisible: false,
          headerShadowVisible: true,
          headerTitleAlign: "center",
          headerTintColor: primaryColor,
          headerTitleStyle: { color },
          headerStyle: { backgroundColor },
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackImage: () => <BackButton />,
        })}
      >
        <RootStack.Group>
          <RootStack.Screen
            name="Accueil"
            component={TabNavigation}
            options={() => ({ headerShown: false })}
          />
          <RootStack.Screen
            name="Quotidien"
            component={QuotidienScreen}
            options={{
              // headerShown: false,
              headerShadowVisible: false,
            }}
          />
          <RootStack.Screen name="Article" component={ArticleScreen} />
          <RootStack.Screen
            name="Chaines"
            component={ChannelsScreen}
            options={{
              headerTitle: "Chaînes",
            }}
          />
          <RootStack.Screen
            name="Chaine"
            component={ChannelScreen}
            options={() => ({ headerShown: false })}
          />
        </RootStack.Group>

        <RootStack.Group
          screenOptions={{
            presentation: "modal",
            headerTitle: "",
            headerShadowVisible: false,
            headerStyle: { backgroundColor, height: 50 },
            headerBackImage: () => <BackButton />,
          }}
        >
          <RootStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerStyle: { backgroundColor: backgroundColorLight } }}
          />
          <RootStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen
            name="Player"
            component={PlayerScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SharArticle"
            component={ShareArticleScreen}
            initialParams={{ title: "", published: "", image: "", channel: "", source: "" }}
            options={{ presentation: "transparentModal", headerShown: false }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
