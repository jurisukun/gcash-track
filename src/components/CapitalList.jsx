import {
  Layout,
  Text,
  TopNavigation,
  Avatar,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import gcash from "../../assets/g.png";
import { ListAccessoriesShowcase } from "./EntryList";
import { Capital } from "../lib/realm";
import { View } from "react-native";

import { useQuery } from "@realm/react";

export default function CapitalList() {
  const capital = useQuery(Capital);

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        title={() => {
          return (
            <View className="flex flex-row items-center justify-center gap-2 p-3">
              <Avatar
                source={gcash}
                size="giant"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                }}
              />
              <Text category="h5">Tracker</Text>
            </View>
          );
        }}
        style={{
          height: 80,
        }}
      />
      <ListAccessoriesShowcase data={capital} />
    </Layout>
  );
}
