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
  Button,
} from "@ui-kitten/components";
import gcash from "../../assets/g.png";
import { useState, useContext } from "react";

import { ModalDialog } from "./Modal";
import { ListAccessoriesShowcase } from "./EntryList";
import SortBy from "./SortBy";
import Total from "./Total";
import { useQuery } from "@tanstack/react-query";
import { getAllRecords } from "../lib/sqlite";

import * as SecureStore from "expo-secure-store";

import { ThemeContext } from "../lib/theme-context";
import Balance from "./Balance";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState("All");
  const [visible, setVisible] = useState(false);
  const [editdata, setEditData] = useState();
  const themeContext = useContext(ThemeContext);

  const { isError, isLoading, data } = useQuery({
    queryKey: ["fetchrecords"],
    queryFn: async () => {
      await SecureStore.getItemAsync("usertheme").then((res) => {
        if (res) {
          themeContext.setDefTheme(res);
        }
      });
      return getAllRecords().then((res) => res);
    },
  });
  if (isError) {
    return (
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
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
        style={{
          height: 80,
        }}
        accessoryRight={() => (
          <>
            <TopNavigationAction
              icon={(props) => (
                <Icon
                  style={{ backgroundColor: "black" }}
                  name={themeContext.deftheme == "light" ? "sun" : "moon"}
                  {...props}
                />
              )}
              onPress={async () => {
                themeContext.toggleTheme();
                await SecureStore.setItemAsync(
                  "usertheme",
                  themeContext.deftheme == "dark" ? "light" : "dark"
                );
              }}
            />
          </>
        )}
      />

      <View className="h-auto flex w-full flex-col space-x-3 gap-3 items-end justify-evenly pb-3">
        {/* <View className="flex flex-row w-full px- items-center gap-2 h-[50px]"></View> */}
        <View className="flex flex-row w-full justify-evenly pb-3">
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              paddingHorizontal: 15,
              marginLeft: 10,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                category="p1"
                status="info"
                style={{ margin: "auto", fontWeight: "800", fontSize: 16 }}
              >
                GCash:
              </Text>
              <Balance />
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                category="p1"
                style={{ margin: "auto", fontWeight: "800", fontSize: 16 }}
                status="info"
              >
                Cash:
              </Text>
              <Balance />
            </View>

            <Button
              style={{ width: 45, height: 40 }}
              onPress={() => setVisible(true)}
              accessoryLeft={(props) => <Icon {...props} name="plus" />}
              size="small"
              // style={{ height: "100%" }}
            />
          </View>
          <View>
            {editdata && (
              <ModalDialog editdata={editdata} setEditData={setEditData} />
            )}
            {visible && (
              <ModalDialog visible={visible} setVisible={setVisible} />
            )}
          </View>
        </View>
      </View>
      <Divider />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          gap: 10,
        }}
      >
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
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </View>
      <ListAccessoriesShowcase data={sortedData} setEditData={setEditData} />
    </Layout>
  );
}
