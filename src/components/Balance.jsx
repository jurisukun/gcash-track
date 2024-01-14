import { View } from "react-native";
import { Button, Icon, Text } from "@ui-kitten/components";
import { useState } from "react";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Capital } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

export default function Balance({ addTo }) {
  const [visible, setVisible] = useState(false);
  const capital = useQuery(Capital);
  const isGcash = addTo == "Gcash";

  const filteredCapital = capital.filtered(`category == "${addTo}"`);
  const total = filteredCapital.sum("amount");

  return (
    <View className=" flex-row gap-1" style={{ alignItems: "center" }}>
      <Text category="h6" style={{ fontSize: 17 }}>
        ₱{total}
      </Text>
      <Text
        category="h6"
        style={{
          width: 20,
          height: 20,
          borderRadius: 50,
          backgroundColor: "#77dd77",
          textAlign: "center",
          textAlignVertical: "center",
          color: "#fff",
          fontSize: 14,
        }}
        onPress={() => setVisible(true)}
      >
        +
      </Text>
      <CapitalModal
        visible={visible}
        setVisible={setVisible}
        typeOfTransaction={{ category: addTo }}
        realmSchema={Capital}
        realmSchemaName={"Capital"}
      />
    </View>
  );
}
