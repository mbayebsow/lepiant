import { useRoute } from "@react-navigation/native";
import { Image, Pressable, ScrollView, Text } from "react-native";

import { Header, LargeHeader, ScalingView, ScrollViewWithHeaders } from '@codeherence/react-native-header';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStyles from "../hook/useStyle";
import { View } from "lucide-react-native";


export default function ChannelScreen() {
    const route = useRoute();
    const { color, colorLight, primaryColor10, primaryColor, backgroundColor, backgroundColorLight } = useStyles()

    const { name, country, fullLogo, id, language, logo, url, sources } = route.params

    const HeaderComponent = ({ showNavBar }) => (
        <Header
            noBottomBorder
            borderWidth={0}
            // headerStyle={{ backgroundColor: "red" }}
            showNavBar={showNavBar}
            headerCenter={<Text style={{ fontSize: 16, fontWeight: 'bold', color }}>{name}</Text>}

        />
    )


    const LargeHeaderComponent = ({ scrollY }) => (
        <LargeHeader >
            <ScalingView scrollY={scrollY} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, }}>
                <Image source={{ uri: logo }} style={{ width: 80, height: 80, borderRadius: 100 }} />
                <ScalingView scrollY={scrollY} >
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color }}>{name}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colorLight }}>{url}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colorLight }}>{country}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: colorLight }}>{language}</Text>
                </ScalingView>
            </ScalingView>
        </LargeHeader>
    )

    return (
        <ScrollViewWithHeaders
            style={{ backgroundColor: "white" }}
            HeaderComponent={HeaderComponent}
            LargeHeaderComponent={LargeHeaderComponent}
        >
            <Text>blblblblblbbl</Text>
        </ScrollViewWithHeaders>
    )
}