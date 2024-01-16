import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  Drawer as DrawerKit,
  DrawerItem,
  IndexPath,
} from "@ui-kitten/components";

import Options from "./Options";
import Dashboard from "./Dashboard";
import { BottomTabNavigator } from "./Tab";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Drawer = createDrawerNavigator();

const DrawerContent = ({ navigation, state }) => (
  <DrawerKit
    style={{ flex: 1 }}
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
  >
    <DrawerItem title="Home" />

    <DrawerItem title="Options" />
  </DrawerKit>
);

export function AppNavigator() {
  // const realm = useRealm();
  // const user = useUser();

  // async function writeCustomUserData(customUserData) {
  //   realm.write(() => {
  //     realm.create(
  //       CustomUserData,
  //       CustomUserData.generate(customUserData),
  //       true
  //     );
  //   });
  // Refresh custom user data once it's been updated on the server
  //   const customUserData = await user.refreshCustomData();
  //   console.log(customUserData);
  // }

  // if (!isLogin) {
  //   writeCustomUserData(customUserData);
  // }

  const insets = useSafeAreaInsets();
  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            headerStyle: {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
            drawerStyle: {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
            sceneContainerStyle: { paddingTop: insets.top },
          }}
        >
          <Drawer.Screen name="Home" component={BottomTabNavigator} />
          <Drawer.Screen name="Options" component={Options} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
