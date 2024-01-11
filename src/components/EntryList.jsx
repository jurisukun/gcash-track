import React, { useState } from "react";
import {
  Button,
  Icon,
  List,
  ListItem,
  Layout,
  Text,
  Divider,
} from "@ui-kitten/components";

import { View } from "react-native";
import { StyleSheet } from "react-native";
import { ModalDialog } from "./Modal";

export const ListAccessoriesShowcase = ({ data, setEditData }) => {
  const renderItemAccessory = (data) => {
    return (
      <>
        <View className="flex flex-row gap-2 items-center justify-center w-[220px]">
          <Text
            category="p2"
            style={{
              width: 90,
              flex: 1,
              flexWrap: "nowrap",
              textAlign: "right",
            }}
          >
            {data.category == "Load"
              ? `${data.category} (${data.load})`
              : data.category}
          </Text>
          <View className="flex flex-col space-x-1 items-end justify-center w-[80px] ]">
            <Text
              status={data.category !== "Cash in" ? "warning" : "success"}
              category="h6"
              style={{ fontSize: 16 }}
            >
              ₱{data.amount}
            </Text>
            <Text
              category="s2"
              status={data.category !== "Cash in" ? "warning" : "success"}
            >
              {`+${data?.fee ?? "0"}`}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderItemIcon = (props) => <Icon {...props} name="person" />;

  const renderItem = ({ item, index }) => (
    <>
      <ListItem
        id={item.id}
        title={item.description}
        description={`${item.date}`}
        accessoryLeft={renderItemIcon}
        accessoryRight={() => renderItemAccessory(item)}
        onPress={() => {
          console.log("pressed");
          setEditData(item);
        }}
      />
      <Divider />
    </>
  );

  return <List style={styles.container} data={data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
