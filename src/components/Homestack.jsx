import React, { useState } from "react";
import { View } from "react-native";
import {
  Text,
  Layout,
  TopNavigation,
  Divider,
  Icon,
} from "@ui-kitten/components";
import { createStackNavigator } from "@react-navigation/stack";
import { ListAccessoriesShowcase, StatsList } from "./EntryList";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import Dashboard from "./Dashboard";
import { ModalDialog } from "./Modal";
import { useSubscribe, useTotalCashinCashoutFees } from "../lib/hooks/useTotal";

import Options from "./Options";
import CapitalList from "./Capital";

export function RecordList() {
  const [editdata, setEditData] = useState();
  const route = useRoute();

  const { gcashSub } = useSubscribe();
  const { monthlyStats } = useTotalCashinCashoutFees();

  let filtereddata =
    route.params.option == "Transfer"
      ? gcashSub.filtered("isTransfer==true")
      : route.params.option == "Stats"
      ? monthlyStats
      : gcashSub.filtered(
          "category==$0 AND isTransfer!= $1",
          route?.params?.option,
          true
        );

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "column",
        flexWrap: "wrap",
        backgroundColor: "#F4F4FF",
      }}
    >
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

      {editdata && (
        <ModalDialog editdata={editdata} setEditData={setEditData} />
      )}

      {route.params.option !== "Stats" && (
        <ListAccessoriesShowcase
          data={filtereddata}
          setEditData={setEditData}
          schema={"GcashTransactions"}
          isCapital={false}
        />
      )}
      {route.params.option == "Stats" && <StatsList data={filtereddata} />}
    </Layout>
  );
}

const Stack = createStackNavigator();

export function Homestack() {
  return (
    <Layout style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={() => {
            return {
              headerShown: false,
              headerStyle: {
                backgroundColor: "#F4F4FF",
              },
            };
          }}
        >
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Records" component={RecordList} />
          <Stack.Screen name="Capital" component={CapitalList} />
          <Stack.Screen name="Others" component={Options} />
        </Stack.Navigator>
      </NavigationContainer>
    </Layout>
  );
}
