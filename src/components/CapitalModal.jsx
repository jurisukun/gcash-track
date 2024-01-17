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
  CheckBox,
} from "@ui-kitten/components";
import { Alert, View } from "react-native";
import { useState } from "react";

import { useRealm, useUser } from "@realm/react";

export const CapitalModal = ({
  editdata,
  setEditData,
  visible,
  setVisible,
  realmSchema,
  realmSchemaName,
  typeOfTransaction,
}) => {
  isExpense = typeOfTransaction?.category == "expense";

  const today = new Date();
  const [data, setData] = useState(
    editdata
      ? { ...editdata }
      : isExpense
      ? { date: today, isPaid: false }
      : { date: today }
  );

  const realm = useRealm();
  const user = useUser();

  const checkValues = (data) => {
    if (!data.description || !data.amount || !data.date) {
      if (isExpense && !data.category) {
        Alert.alert("Invalid", "Please fill up all fields");
        return;
      }
      Alert.alert("Invalid", "Please fill up all fields");
      return;
    }
    realm.write(() => {
      editdata
        ? realm.create(
            realmSchemaName,
            {
              ...editdata,
              ...data,
              updatedAt: today,
              updatedBy: user.id,
            },
            true
          )
        : realm.create(
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
    editdata ? setEditData(false) : setVisible(false);
  };

  return (
    <View>
      <Modal
        style={{ flex: 1 }}
        visible={editdata ? true : visible}
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <Card
          style={{
            flex: 1,
            width: 300,
            rowGap: 10,
            padding: 5,
            borderRadius: 10,
          }}
          header={() => {
            return (
              <View className="flex item-center justify-center px-5">
                <Text category="h5">
                  {editdata
                    ? "Edit"
                    : isExpense
                    ? "New Expense"
                    : "Add Capital"}
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
                    editdata
                      ? setEditData(null)
                      : () => {
                          setVisible(false);
                          setData({ date: today });
                        };
                  }}
                >
                  CANCEl
                </Button>
                <Button
                  onPress={() => {
                    checkValues(data);
                  }}
                >
                  {editdata ? "EDIT" : "SAVE"}
                </Button>
              </View>
            );
          }}
        >
          <View style={{ rowGap: 10 }}>
            <Input
              defaultValue={data?.description}
              label="Description"
              placeholder="Enter description"
              onChangeText={(val) =>
                setData((prev) => ({ ...prev, description: val }))
              }
            />
            <Input
              defaultValue={data?.amount?.toString()}
              label="Amount"
              placeholder="Enter amount"
              onChangeText={(val) =>
                setData((prev) => ({ ...prev, amount: val }))
              }
            />
            <Datepicker
              date={data?.date}
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
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  alignContent: "flex-end",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <Select
                  style={{ flex: 1, width: 150 }}
                  label="Payment"
                  value={data?.category ?? null}
                  placeholder="Select payment method"
                  onSelect={(sel) => {
                    if (sel.row == 0) {
                      setData((prev) => ({ ...prev, category: "PHP" }));
                    } else {
                      setData((prev) => ({ ...prev, category: "GCash" }));
                    }
                  }}
                >
                  <SelectItem title="PHP" />
                  <SelectItem title="GCash" />
                </Select>
                <View>
                  <CheckBox
                    style={{ flexDirection: "column", width: 70 }}
                    checked={data.isPaid}
                    onChange={(val) =>
                      setData((prev) => ({ ...prev, isPaid: val }))
                    }
                  >
                    {data.isPaid ? "Paid" : "Unpaid"}
                  </CheckBox>
                </View>
              </View>
            )}
          </View>
        </Card>
      </Modal>
    </View>
  );
};
