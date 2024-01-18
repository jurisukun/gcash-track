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
import { useEmailPasswordAuth, useRealm, useUser } from "@realm/react";
import { CapitalTransactions } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

import { useSubscribe } from "../lib/hooks/useTotal";

export const BurgerIcon = (props) => {
  return <Icon name="menu" {...props} onPress={() => {}} />;
};

export const BurgerAction = () => <TopNavigationAction icon={BurgerIcon} />;

export default function Options() {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editdata, setEditData] = useState();
  const user = useUser();
  const realm = useRealm();
  const capital = useSubscribe().capitalSub;

  const { logOut } = useEmailPasswordAuth();

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
      <OverflowMenu
        visible={visible}
        placement={"bottom end"}
        onBackdropPress={() => setVisible(false)}
        anchor={() => {
          return <View className="bg-white"></View>;
        }}
        onSelect={(index) => {
          if (index.row == 0) {
            logOut();
          }
        }}
      >
        <MenuItem title="Logout" />
      </OverflowMenu>
      <TopNavigation
        accessoryLeft={BurgerAction}
        title="Options"
        accessoryRight={() => (
          <>
            <TopNavigationAction
              icon={(props) => (
                <Icon
                  style={{ backgroundColor: "black" }}
                  name={"more-vertical-outline"}
                  {...props}
                />
              )}
              onPress={() => {
                setVisible(true);
              }}
            />
          </>
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
            {" "}
            Paid:{" "}
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
            {" "}
            Unpaid:{" "}
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
          // style={{ height: "100%" }}
        />
      </View>
      <List data={capital} renderItem={renderItem} style={{ flex: 1 }} />
    </Layout>
  );
}

export const customTopNavigation = (props) => {
  return <TopNavigation {...props} accessoryLeft={BurgerAction} />;
};
