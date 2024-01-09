import { View } from "react-native";
import {
  TopNavigation,
  Text,
  Layout,
  Divider,
  Icon,
  TopNavigationAction,
  Spinner,
  Avatar,
} from "@ui-kitten/components";
import gcash from "../../assets/g.png";
import { useState, useContext } from "react";

import { ModalDialog } from "./Modal";
import { ListAccessoriesShowcase } from "./EntryList";
import SortBy from "./SortBy";
import Total from "./Total";
import { useQuery } from "@tanstack/react-query";
import { getAllRecords } from "../lib/sqlite";

import { ThemeContext } from "../lib/theme-context";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState("All");
  const themeContext = useContext(ThemeContext);

  const { isError, isLoading, data } = useQuery({
    queryKey: ["fetchrecords"],
    queryFn: () => getAllRecords().then((res) => res),
  });
  if (isError) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h4">Error fetching records...</Text>
      </Layout>
    );
  }
  if (isLoading) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner status="warning" />
      </Layout>
    );
  }

  let sortedData = data.filter((row) => {
    if (sortBy == "All") return true;
    else return row.category == sortBy;
  });

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
        // style={{
        //   height: 80,
        //   backgroundColor: "violet",
        // }}
        accessoryRight={() => (
          <TopNavigationAction
            icon={(props) => (
              <Icon
                style={{ backgroundColor: "black" }}
                name={themeContext.deftheme == "light" ? "sun" : "moon"}
                {...props}
              />
            )}
            onPress={themeContext.toggleTheme}
          />
        )}
      />

      <View className="h-auto flex w-full flex-col space-x-3 gap-3 items-end justify-evenly pb-3">
        <View className="flex flex-row w-full px-5 justify-between">
          <Total
            records={{
              category: "Cash in",
              data: data.filter((row) => row.category == "Cash in"),
            }}
          />
          <Total
            category="Cash out"
            records={{
              category: "Cash out",
              data: data.filter((row) => row.category !== "Cash in"),
            }}
          />
        </View>
        <View className="flex flex-row w-full justify-evenly pb-3">
          <View>
            <SortBy sortBy={sortBy} setSortBy={setSortBy} />
          </View>
          <View>
            <ModalDialog />
          </View>
        </View>
      </View>
      <Divider />
      <ListAccessoriesShowcase data={sortedData} />
    </Layout>
  );
}
