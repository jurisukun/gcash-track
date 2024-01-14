import { View } from "react-native";
import { Button, Icon, Text } from "@ui-kitten/components";
import { useState } from "react";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Capital } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

export default function Balance({ addTo }) {
  const [visible, setVisible] = useState(false);

  return (
    <View className=" flex-row gap-1" style={{ alignItems: "center" }}>
      <Text category="h6" style={{ fontSize: 20 }}>
        ₱500
      </Text>
      <Text
        category="h6"
        status="success"
        style={{
          width: 25,
          height: 25,
          borderRadius: 50,
          backgroundColor: "green",
          textAlign: "center",
          textAlignVertical: "center",
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
