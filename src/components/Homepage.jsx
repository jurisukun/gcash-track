import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { Text, Layout, Card, Icon } from "@ui-kitten/components";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@ui-kitten/components";
import { ThemeContext } from "../lib/theme-context";

const options = [
  "Cash in",
  "Cash out",
  "Load",
  "Transfer",
  "Capital",
  "Debts",
  "Stats",
  "Soon...",
];
const icons = [
  "download",
  "upload",
  "phone",
  "refresh-cw",
  "dollar-sign",
  "database",
  "activity",
  "clock",
];

export default function Homepage() {
  const navigation = useNavigation();
  const { deftheme } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <Layout
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          backgroundColor:
            deftheme == "light"
              ? theme["color-primary-100"]
              : theme["color-basic-700"],
          justifyContent: "space-evenly",
          alignItems: "center",
          paddingVertical: "5%",
        }}
        style={{ flex: 1 }}
      >
        {options.map((option, index) => {
          return (
            <Card
              disabled={index == options.length - 1}
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
              onPress={() => {
                if (index > options.length - 1) {
                  return;
                }

                index < 4 || index == 6
                  ? navigation.navigate("Records", {
                      option,
                      icon: icons[index],
                    })
                  : option == "Capital"
                  ? navigation.navigate(option, { option, icon: icons[index] })
                  : navigation.navigate("Others", {
                      option,
                      icon: icons[index],
                    });

                index;
              }}
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
                    flexWrap: "nowrap",
                  }}
                >
                  {option}
                </Text>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </Layout>
  );
}
