import React, { useState } from "react";
import { View } from "react-native";
import {
  Text,
  Layout,
  TopNavigation,
  Divider,
  Icon,
  Select,
  SelectItem,
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

  const [descending, setDescending] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("date");
  const [index, setIndex] = React.useState(0);

  const sortOptions = [
    "Date (Desc)",
    "Date (Asc)",
    "Description (Z-A)",
    "Description (A-Z)",
    "Price (High-Low)",
    "Price (Low-High)",
  ];

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

  const sortedData =
    route.params.option == "Stats"
      ? filtereddata
      : filtereddata?.sorted(sortBy, descending);
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
            className="flex flex-row "
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
        accessoryRight={(props) =>
          route.params.option !== "Stats" && (
            <Select
              value={sortOptions[index]}
              style={{ width: 150 }}
              onSelect={(sel) => {
                setIndex(sel.row);
                if ((sel.row + 1) % 2 == 0) {
                  setDescending(false);
                } else {
                  setDescending(true);
                }
                switch (sel.row) {
                  case 0 || 1:
                    setSortBy("date");
                    break;
                  case 2 || 3:
                    setSortBy("description");
                    break;
                  case 4 || 5:
                    setSortBy("amount");
                    break;
                }
              }}
              placeholder="Sort by"
            >
              {sortOptions.map((item, index) => (
                <SelectItem key={index} title={item} />
              ))}
            </Select>
          )
        }
      />
      <Divider />

      {editdata && (
        <ModalDialog editdata={editdata} setEditData={setEditData} />
      )}

      {route.params.option !== "Stats" && (
        <ListAccessoriesShowcase
          data={sortedData}
          setEditData={setEditData}
          schema={"GcashTransactions"}
          isCapital={false}
        />
      )}
      {route.params.option == "Stats" && <StatsList data={sortedData} />}
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
