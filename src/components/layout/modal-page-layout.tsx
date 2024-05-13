import {
  ColorValue,
  DimensionValue,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import React, { FC, ReactNode, useCallback, useEffect } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ModalPageLayoutPros {
  children: ReactNode;
  backgroundColor?: ColorValue;
  backgroundComponent?: ReactNode;
  height?: DimensionValue;
}

const ModalPageLayout: FC<ModalPageLayoutPros> = ({
  children,
  backgroundColor,
  backgroundComponent,
  height,
}) => {
  const navigation = useNavigation();
  const context = useSharedValue({ y: 0 });
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const scrollTo = useCallback(
    (destination: number) => {
      "worklet";
      translateY.value = withSpring(destination, { damping: 50 });
    },
    [children],
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate(event => {
      if (event.translationY > 0) {
        translateY.value = event.translationY + context.value.y;
      }
    })
    .onEnd(event => {
      if (event.velocityY > SCREEN_HEIGHT / 3) {
        scrollTo(SCREEN_HEIGHT);
        runOnJS(navigation.goBack)();
      } else {
        scrollTo(-SCREEN_HEIGHT / event.absoluteY);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      width: "100%",
      borderRadius: 30,
      overflow: "hidden",
    };
  });

  useEffect(() => {
    scrollTo(0);
  }, [children]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          rBottomSheetStyle,
          {
            flex: 1,
            justifyContent: "flex-end",
          },
        ]}>
        <View style={styles.backgroundComponent}>{backgroundComponent}</View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={[styles.content, { backgroundColor: backgroundColor || "transparent" }]}>
            <SafeAreaView style={{ zIndex: 2 }}>
              <View style={styles.line} />
              {children}
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  backgroundComponent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 100,
  },
});

export default ModalPageLayout;
