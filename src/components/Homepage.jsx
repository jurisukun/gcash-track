import React, { useContext } from "react";
import { View } from "react-native";
import { Text, Layout, Card, Icon } from "@ui-kitten/components";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@ui-kitten/components";
import { ThemeContext } from "../lib/theme-context";

const options = ["Cash in", "Cash out", "Load", "Transfer", "Capital", "Debts"];
const icons = [
  "download",
  "upload",
  "phone",
  "refresh-cw",
  "dollar-sign",
  "database",
];

export default function Homepage() {
  const navigation = useNavigation();
  const { deftheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor:
          deftheme == "light"
            ? theme["color-primary-100"]
            : theme["color-basic-700"],
      }}
    >
      {options.map((option, index) => {
        return (
          <Card
            key={index}
            style={{
              width: "30%",
              aspectRatio: 1,
              marginHorizontal: "5%",
              marginVertical: "4%",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#9595DB",
            }}
            onPress={() =>
              index < 4
                ? navigation.navigate("Records", {
                    option,
                    icon: icons[index],
                  })
                : option == "Capital"
                ? navigation.navigate(option, { option, icon: icons[index] })
                : navigation.navigate("Others", { option, icon: icons[index] })
            }
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                rowGap: 10,
              }}
            >
              <Icon
                name={icons[index]}
                fill="#CCCCFF"
                style={{
                  width: 32,
                  height: 32,
                  margin: "auto",
                  color: "#CCCCFF",
                }}
                pack="feather"
              />
              <Text
                category="s2"
                style={{
                  fontWeight: "700",
                }}
              >
                {option}
              </Text>
            </View>
          </Card>
        );
      })}
    </Layout>
  );
}
