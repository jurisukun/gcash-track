import { View } from "react-native";
import { TopNavigation, Text, Layout, Divider } from "@ui-kitten/components";
import { useState } from "react";

import { ModalDialog } from "./Modal";
import { ListAccessoriesShowcase } from "./EntryList";
import SortBy from "./SortBy";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState("All");

  return (
    <Layout
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TopNavigation
        title="MyApp"
        style={{
          height: 80,
        }}
      />
      <Divider />
      <View className="h-16 flex w-full flex-row space-x-3 gap-3 items-end justify-evenly pb-3">
        <View>
          <SortBy sortBy={sortBy} setSortBy={setSortBy} />
        </View>
        <View>
          <ModalDialog />
        </View>
      </View>
      <Divider />
      <ListAccessoriesShowcase />
    </Layout>
  );
}
