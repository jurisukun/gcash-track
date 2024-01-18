import { View } from "react-native";
import { Text } from "@ui-kitten/components";
import { useState } from "react";

import { Capital } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

export default function Balance({ addTo, balance }) {
  const [visible, setVisible] = useState(false);

  return (
    <View className=" flex-row gap-1" style={{ alignItems: "center" }}>
      <Text category="h6" style={{ fontSize: 17 }}>
        ₱{balance}
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
      {visible && (
        <CapitalModal
          visible={visible}
          setVisible={setVisible}
          typeOfTransaction={{ category: addTo }}
          realmSchema={Capital}
          realmSchemaName={"Capital"}
        />
      )}
    </View>
  );
}
