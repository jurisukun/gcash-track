import { View } from "react-native";
import { Button, Icon, Text } from "@ui-kitten/components";
import { useState } from "react";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Capital, GcashTransactions } from "../lib/realm";
import { CapitalModal } from "./CapitalModal";

import { useTotal, useTotalTransfer } from "../lib/hooks/useTotal";

export default function Balance({ addTo }) {
  const isGcash = addTo == "Gcash";
  const category = "Cash in";

  const [visible, setVisible] = useState(false);
  const capital = useQuery(Capital);
  const gcash = useQuery(GcashTransactions);
  let c = isGcash ? "category == 'Cash in'" : "category != 'Cash in'";
  let d = isGcash ? "payment == 'Gcash'" : "payment != 'Gcash'";

  let e = isGcash ? "category == 'Cash in'" : "category == 'Cash out'";
  let f = isGcash ? "payment == 'Gcash'" : "payment != 'Gcash'";

  let g = isGcash ? "category == 'Cash out'" : "category == 'Cash in'";

  const totalAmountDeduction = gcash
    .filtered(c)
    .filtered("isTransfer!=true")
    .sum("amount");
  const totalFeeAddition = gcash
    .filtered(d)
    .filtered("isTransfer!=true")
    .sum("fee");

  const totalTransfer = gcash
    .filtered(e)
    .filtered("isTransfer==true")
    .sum("amount");
  const totalTransFerDeduction = gcash
    .filtered("isTransfer==true")
    .filtered(g)
    .sum("amount");
  const totalTransferFee = gcash
    .filtered(f)
    .filtered("isTransfer==true")
    .sum("fee");

  // const totalFeeAddition = useTotal(
  //   GcashTransactions,
  //   "payment",
  //   isGcash ? true : false,
  //   "Gcash",
  //   "fee"
  // );

  // const totalTransfer = useTotalTransfer(
  //   GcashTransactions,
  //   "category",
  //   isGcash ? false : true,
  //   "Cash in",
  //   "amount"
  // );

  // const totalTransferFee = useTotalTransfer(
  //   GcashTransactions,
  //   "payment",
  //   isGcash ? true : false,
  //   "Gcash",
  //   "fee"
  // );

  const filteredCapital = capital
    .filtered(`category == "${addTo}"`)
    .sum("amount");

  const total =
    filteredCapital -
    totalAmountDeduction +
    totalFeeAddition +
    totalTransfer -
    totalTransFerDeduction -
    totalTransferFee;

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
