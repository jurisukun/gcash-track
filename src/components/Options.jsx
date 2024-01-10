import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Icon,
  IconElement,
} from "@ui-kitten/components";
import { View } from "react-native";

export const BurgerIcon = (props) => {
  return <Icon name="menu" {...props} onPress={() => {}} />;
};

export const BurgerAction = () => <TopNavigationAction icon={BurgerIcon} />;

export default function Options() {
  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation accessoryLeft={BurgerAction} acces title="Options" />
      <Divider />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="h1">Options</Text>
      </View>
    </Layout>
  );
}

export const customTopNavigation = (props) => {
  return <TopNavigation {...props} accessoryLeft={BurgerAction} />;
};
