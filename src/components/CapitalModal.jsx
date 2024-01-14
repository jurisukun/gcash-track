import {
  Modal,
  Card,
  Text,
  Input,
  Datepicker,
  Button,
  Icon,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { View } from "react-native";
import { useState } from "react";

import { useRealm, useUser } from "@realm/react";
import { set } from "date-fns";

export const CapitalModal = ({
  visible,
  setVisible,
  realmSchema,
  realmSchemaName,
  typeOfTransaction,
}) => {
  isExpense = typeOfTransaction.catgoery == "expense";
  const today = new Date();
  const [data, setData] = useState({ date: today });

  const realm = useRealm();
  const user = useUser();

  return (
    <View>
      <Modal style={{ flex: 1 }} visible={visible}>
        <Card
          style={{
            flex: 1,
            width: 300,

            rowGap: 20,
            padding: 5,
            borderRadius: 10,
          }}
          header={() => {
            return (
              <View className="flex item-center justify-center px-5">
                <Text category="h5">
                  {isExpense ? "New Expense" : "Add Capital"}
                </Text>
              </View>
            );
          }}
          footer={() => {
            return (
              <View className="flex flex-row justify-center items-center gap-12 py-3">
                <Button
                  appearance="outline"
                  onPress={() => {
                    setVisible(false);
                    setData({ date: today });
                  }}
                >
                  CANCEl
                </Button>
                <Button
                  onPress={() => {
                    realm.write(() => {
                      realm.create(
                        realmSchemaName,
                        realmSchema.generate(
                          isExpense
                            ? {
                                ...data,
                                userId: user.id,
                              }
                            : {
                                ...data,
                                userId: user.id,
                                category: typeOfTransaction.category,
                              }
                        )
                      );
                    });
                    setData({ date: today });
                    setVisible(false);
                  }}
                >
                  SAVE
                </Button>
              </View>
            );
          }}
        >
          <Input
            label="Description"
            placeholder="Enter description"
            onChangeText={(val) =>
              setData((prev) => ({ ...prev, description: val }))
            }
          />
          <Input
            label="Amount"
            placeholder="Enter amount"
            onChangeText={(val) =>
              setData((prev) => ({ ...prev, amount: val }))
            }
          />
          <Datepicker
            date={data.date}
            label="Date"
            placeholder="Pick date"
            onSelect={(val) => {
              setData((prev) => ({ ...prev, date: val }));
            }}
            accessoryRight={(props) => {
              return (
                <Icon {...props} name="calendar">
                  Today
                </Icon>
              );
            }}
            placement="right end"
            backdropStyle={{
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 5,
            }}
          />
          {isExpense && (
            <Select
              label="Payment"
              placeholder="Select payment method"
              onSelect={(sel) => {
                if (sel.row) {
                  setData((prev) => ({ ...prev, category: "PHP" }));
                } else {
                  setData((prev) => ({ ...prev, category: "GCash" }));
                }
              }}
            >
              <SelectItem title="PHP" />
              <SelectItem title="GCash" />
            </Select>
          )}
        </Card>
      </Modal>
    </View>
  );
};
