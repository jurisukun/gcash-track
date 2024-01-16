import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
} from "@ui-kitten/components";
import Dashboard from "./Dashboard";
import CapitalList from "./CapitalList";

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="TRANSACTIONS" />
    <BottomNavigationTab title="CAPITAL" />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={(props) => <BottomTabBar {...props} />}
  >
    <Screen name="Transactions" component={Dashboard} />
    <Screen name="Capital" component={CapitalList} />
  </Navigator>
);

export const BottomTabNavigator = () => (
  <NavigationContainer independent={true}>
    <TabNavigator />
  </NavigationContainer>
);
