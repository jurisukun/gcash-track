import React, { useEffect } from "react";
import {
  Button,
  Icon,
  List,
  ListItem,
  Layout,
  Text,
} from "@ui-kitten/components";

import { View } from "react-native";
import { StyleSheet } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { getAllRecords } from "../lib/sqlite";

export const ListAccessoriesShowcase = ({ data }) => {
  // const { isError, isLoading, data} = useQuery({
  //   queryKey: ["fetchrecords"],
  //   queryFn: () => getAllRecords().then((res) => res),
  // });
  // if (isError) {
  //   return (
  //     <Layout
  //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  //     >
  //       <Text category="h4">Error fetching records...</Text>
  //     </Layout>
  //   );
  // }

  const renderItemAccessory = (data) => {
    if (data.category !== "Cash in") {
      return (
        <View className="flex flex-row gap-8 px-4 items-center justify-center">
          <Text category="s2">{data.category}</Text>
          <Text status="danger" category="h6">
            ₱{data.amount}
          </Text>
        </View>
      );
    } else {
      return (
        <View className="flex flex-row gap-8 px-4 items-center justify-center">
          <Text category="s2">{data.category}</Text>
          <Text status="success" category="h6">
            ₱{data.amount}
          </Text>
        </View>
      );
    }
  };

  const renderItemIcon = (props) => <Icon {...props} name="person" />;

  const renderItem = ({ item, index }) => (
    <ListItem
      title={item.description}
      description={`${item.date}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={() => renderItemAccessory(item)}
    />
  );

  return <List style={styles.container} data={data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
