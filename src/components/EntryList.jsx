import React from "react";
import { Icon, List, ListItem, Text, Divider } from "@ui-kitten/components";

import { Alert, View } from "react-native";
import { StyleSheet } from "react-native";

import { format, toDate } from "date-fns";
import { useUser, useRealm } from "@realm/react";

export const ListAccessoriesShowcase = ({
  data,
  setEditData,
  schema,
  isCapital,
}) => {
  const realm = useRealm();
  const user = useUser();

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
              status={
                isCapital
                  ? "info"
                  : data?.isTransfer
                  ? "danger"
                  : data.category !== "Cash in" && data.category !== "Load"
                  ? "danger"
                  : "info"
              }
              category="h6"
              style={{ fontSize: 14 }}
            >
              ₱{data.amount}
            </Text>
            {!isCapital && (
              <Text
                category="s2"
                status={
                  data?.isTransfer
                    ? "danger"
                    : data.category !== "Cash in" && data.category !== "Load"
                    ? "danger"
                    : "info"
                }
              >
                {data?.isTransfer ? `-${data?.fee}` : `+${data?.fee ?? "0"}`}
              </Text>
            )}
          </View>
        </View>
      </>
    );
  };

  const renderItemIcon = (props, item) => (
    <Icon
      {...props}
      name={item?.isTransfer ? "swap-outline" : isCapital ? "money" : "person"}
      pack={isCapital ? "fontawesome" : "eva"}
    />
  );

  const renderItem = ({ item, index }) => (
    <>
      <ListItem
        style={{ paddingRight: 20 }}
        id={item._id}
        title={item.description}
        description={`${format(toDate(item.date), "MMM dd, yyyy")}`}
        accessoryLeft={(props) => renderItemIcon(props, item)}
        accessoryRight={() => renderItemAccessory(item)}
        onPress={() => {
          setEditData(item);
        }}
        onLongPress={() => {
          Alert.alert("Delete", "Are you sure you want to delete this entry?", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => {
                realm.write(() => {
                  realm.create(
                    schema,
                    {
                      ...item,
                      deletedAt: new Date(),
                      deletedBy: user.id,
                    },
                    true
                  );
                });
              },
            },
          ]);
        }}
      />
      <Divider />
    </>
  );

  return <List style={styles.container} data={data} renderItem={renderItem} />;
};

export const StatsList = ({ data }) => {
  const renderItemAccessory = (data) => {
    return (
      <>
        <View
          className="flex flex-row gap-2 items-center justify-evenly w-[70%] "
          style={{ gap: 5 }}
        >
          <View className="flex flex-col space-x-1 items-center justify-center ">
            <Text category="s2">Cash in</Text>
            <Text
              category="h6"
              style={{ fontSize: 12, color: "yellowgreen" }}
              status="success"
            >
              ₱{data?.cashintotal ?? "0"}
            </Text>
            <Text
              category="s2"
              status="success"
              style={{ color: "yellowgreen" }}
            >
              +{data.cashintotalfee}
            </Text>
          </View>
          <View className="flex flex-col space-x-1 items-center justify-center ">
            <Text category="s2">Cash out</Text>
            <Text category="h6" style={{ fontSize: 12 }} status="info">
              ₱{data?.cashouttotal ?? "0"}
            </Text>
            <Text category="s2" status="info">
              +{data.cashouttotalfee}
            </Text>
          </View>
          <View className="flex flex-col space-x-1 items-center justify-center ">
            <Text category="s2">Fees</Text>
            <Text category="h6" style={{ fontSize: 12 }} status="danger">
              -₱{data?.cashtransferfee ?? "0"}
            </Text>
            <Text category="s2" status="danger" style={{ fontSize: 12 }}>
              -₱{data.gcashtransferfee}
            </Text>
          </View>
          <View className="flex flex-col space-x-1 items-center justify-center ">
            <Text category="h6" status="primary" style={{ fontSize: 16 }}>
              +₱
              {data?.cashouttotalfee +
                data.cashintotalfee -
                (data.gcashtransferfee + data.cashtransferfee) ?? "0"}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderItemIcon = (props, item) => (
    <View className="w-[30%] flex flex-row items-center justify-center">
      <Icon {...props} name={"bar-chart-outline"} />
      <Text
        category="h6"
        style={{
          width: 120,
          flex: 1,
          fontSize: 14,
          flexWrap: "nowrap",
          textAlign: "center",
        }}
      >
        {item?.month}
      </Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <>
      <ListItem
        style={{ height: 80 }}
        id={index}
        accessoryLeft={(props) => renderItemIcon(props, item)}
        accessoryRight={() => renderItemAccessory(item)}
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
