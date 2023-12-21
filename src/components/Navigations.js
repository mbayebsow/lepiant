import { View } from "react-native";
import { Newspaper, BoomBox, Library, X, ChevronLeft } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import NewsScreen from "../screens/News.screen";
import QuotidienScreen from "../screens/Quotidien.screen";
import RadioScreen from "../screens/Radios.screen";
import ProfileScreen from "../screens/Profile.screen";
import LibraryScreen from "../screens/Library.screen";
import PlayerScreen from "../screens/Player.screen";
import ArticleScreen from "../screens/Article.screen";
import ChannelsScreen from "../screens/Channels.screen";
import ProfileEditScreen from "../screens/ProfileEdit.screen";
import ShareArticleScreen from "../screens/ShareArticle.screen";
import LoginScreen from "../screens/Login.screen";
import ChannelScreen from "../screens/Channel.screen";

import useStyles from "../hook/useStyle";

const TabStack = createBottomTabNavigator();
const RootStack = createStackNavigator();


function TabNavigation() {
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
        },
        headerShown: false
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
}

function RootNavigation() {
  const { backgroundColor, backgroundColorLight, primaryColor, color, colorLight, primaryColor10 } = useStyles();

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
          headerTitle: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "left",
          headerTintColor: primaryColor,
          headerTitleStyle: { color },
          headerStyle: { backgroundColor, height: 100 },
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackImage: () => (
            <View style={{ backgroundColor: primaryColor10, padding: 5, borderRadius: 100 }}>
              <ChevronLeft color={primaryColor} size={24} />
            </View>
          ),
        })}
      >
        <RootStack.Group>
          <RootStack.Screen name="Accueil" component={TabNavigation} options={() => ({ headerShown: false })} />
          <RootStack.Screen name="Quotidien" component={QuotidienScreen} />
          <RootStack.Screen name="Article" component={ArticleScreen} />
          <RootStack.Screen name="Chaines" component={ChannelsScreen} />
          <RootStack.Screen name="Chaine" component={ChannelScreen} options={() => ({ headerShown: false })} />
        </RootStack.Group>

        <RootStack.Group
          screenOptions={{
            presentation: "modal",
            headerTitle: '',
            headerBackImage: () => (
              <View style={{ backgroundColor: primaryColor10, padding: 5, borderRadius: 100 }}>
                <X color={primaryColor} size={24} />
              </View>
            ),
          }}
        >
          <RootStack.Screen name="Profile" component={ProfileScreen} options={{ headerStyle: { backgroundColor: backgroundColorLight } }} />
          <RootStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
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
}
export default function Navigations() {
  return <RootNavigation />;
}
