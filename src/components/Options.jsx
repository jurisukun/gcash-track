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
import { View } from "react-native";
import { useState } from "react";
import { useEmailPasswordAuth, useRealm, useQuery } from "@realm/react";
import { CapitalTransactions } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

export const BurgerIcon = (props) => {
  return <Icon name="menu" {...props} onPress={() => {}} />;
};

export const BurgerAction = () => <TopNavigationAction icon={BurgerIcon} />;

export default function Options() {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { logOut } = useEmailPasswordAuth();

  const capital = useQuery(CapitalTransactions);

  const renderItem = ({ item, index }) => (
    <>
      <ListItem
        id={item._id}
        title={item.description}
        description={`${format(toDate(item.date), "MMM dd, yyyy")}`}
        accessoryRight={() => renderItemAccessory(item)}
      />
      <Divider />
    </>
  );

  const renderItemAccessory = (data) => {
    return (
      <>
        <View className="flex flex-row gap-2 items-center justify-end px-3">
          <View className="flex flex-col space-x-1 items-end justify-center w-[80px] ]">
            <Text category="h6" style={{ fontSize: 16 }} status="danger">
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
          setVisible={setModalVisible}
          visible={modalVisible}
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
        {/* <MenuItem title="optionq" />
        <MenuItem title="Option2" /> */}
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
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: 20,
        }}
      >
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
