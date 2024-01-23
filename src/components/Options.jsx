import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Icon,
  OverflowMenu,
  MenuItem,
  List,
  ListItem,
  Button,
} from "@ui-kitten/components";

import { format, toDate } from "date-fns";
import { Alert, View } from "react-native";
import { useState } from "react";

import { CapitalTransactions } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

import { useSubscribe } from "../lib/hooks/useTotal";
import { useRoute } from "@react-navigation/native";
import { useUser, useRealm } from "@realm/react";

export default function Options() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editdata, setEditData] = useState();
  const user = useUser();
  const realm = useRealm();
  const capital = useSubscribe().capitalSub;
  const route = useRoute();

  const deleteTransaction = (data) => {
    Alert.alert("Delete", "Are you sure you want to delete this transaction?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          realm.write(() => {
            realm.create(
              CapitalTransactions,
              { ...data, deletedAt: new Date(), deletedBy: user.id },
              true
            );
          });
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <>
      <ListItem
        id={item._id}
        title={item.description}
        description={`${format(toDate(item.date), "MMM dd, yyyy")}`}
        accessoryRight={() => renderItemAccessory(item)}
        onPress={() => setEditData(item)}
        onLongPress={() => deleteTransaction(item)}
      />
      <Divider />
    </>
  );

  const renderItemAccessory = (data) => {
    return (
      <>
        <View className="flex flex-row gap-2 items-center justify-end px-3">
          <View
            className="flex flex-row space-x-1 items-center justify-between"
            style={{ gap: 40, justifyContent: "space-between" }}
          >
            <Text category="h6" style={{ fontSize: 12 }}>
              {data.isPaid ? "Paid" : "Unpaid"}
            </Text>
            <Text
              category="h6"
              style={{ fontSize: 16 }}
              status={data.isPaid ? "success" : "danger"}
            >
              ₱{data.amount}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <Layout style={{ flex: 1, flexDirection: "column" }}>
      {modalVisible && (
        <CapitalModal
          editdata={editdata ? { ...editdata } : null}
          setEditData={setEditData}
          setVisible={setModalVisible}
          visible={modalVisible}
          typeOfTransaction={{ category: "expense" }}
          realmSchema={CapitalTransactions}
          realmSchemaName={"CapitalTransactions"}
        />
      )}
      {editdata && (
        <CapitalModal
          editdata={editdata ? { ...editdata } : null}
          setEditData={setEditData}
          typeOfTransaction={{ category: "expense" }}
          realmSchema={CapitalTransactions}
          realmSchemaName={"CapitalTransactions"}
        />
      )}

      <TopNavigation
        style={{ paddingHorizontal: 20, height: 60 }}
        accessoryLeft={(props) => (
          <View
            className="flex flex-row"
            style={{ gap: 10, alignItems: "center" }}
          >
            <Text category="h5" style={{ fontWeight: "700" }}>
              {route.params.option}
            </Text>
            <Icon
              {...props}
              name={route?.params?.icon}
              pack="feather"
              fill="#CCCCFF"
              style={{
                width: 22,
                height: 22,
                margin: "auto",
                color: "#CCCCFF",
              }}
            />
          </View>
        )}
      />
      <Divider />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: 20,
        }}
      >
        <View
          className="flex, flex-row items-center"
          style={{ gap: 8, alignContent: "center", alignItems: "center" }}
        >
          <Text category="p1" style={{ fontWeight: "700" }}>
            Paid
          </Text>
          <Text category="h6" status="success">
            ₱{capital.filtered("isPaid==true").sum("amount")}
          </Text>
        </View>
        <View
          className="flex, flex-row items-center"
          style={{ gap: 8, alignContent: "center", alignItems: "center" }}
        >
          <Text category="p1" style={{ fontWeight: "700" }}>
            Unpaid:
          </Text>
          <Text category="h6" status="danger">
            ₱{capital.filtered("isPaid==false").sum("amount")}
          </Text>
        </View>
        <Button
          style={{ width: 45, height: 40 }}
          onPress={() => setModalVisible(true)}
          accessoryLeft={(props) => <Icon {...props} name="plus" />}
          size="small"
        />
      </View>
      <List data={capital} renderItem={renderItem} style={{ flex: 1 }} />
    </Layout>
  );
}

export const customTopNavigation = (props) => {
  return <TopNavigation {...props} accessoryLeft={BurgerAction} />;
};
