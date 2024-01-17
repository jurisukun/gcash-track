import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Modal,
  Text,
  Input,
  Icon,
  Datepicker,
  Select,
  SelectItem,
  OverflowMenu,
  MenuItem,
  Divider,
  CheckBox,
} from "@ui-kitten/components";
import { Alert } from "react-native";
import { format, set, toDate } from "date-fns";

import { useRealm, useUser } from "@realm/react";
import { GcashTransactions } from "../lib/realm";
import { useTotalGcashCashBalance } from "../lib/hooks/useTotal";

export const ModalDialog = ({ visible, setVisible, editdata, setEditData }) => {
  let today = new Date();

  const [date, setDate] = React.useState(today);
  const [data, setData] = React.useState(
    editdata ?? {
      date: today,
      isTransfer: false,
    }
  );
  const [fee, setFee] = React.useState(editdata ? editdata.fee : 0);
  const [loadOptions, setLoadOptions] = React.useState(false);

  const realm = useRealm();
  const user = useUser();

  const gcashBalance = useTotalGcashCashBalance("Gcash");
  const cashBalance = useTotalGcashCashBalance("Cash");

  const checkValues = (data) => {
    if (
      !data.description ||
      !data.amount ||
      !data.date ||
      !data.category ||
      !data.fee ||
      !data.payment
    ) {
      Alert.alert(
        "Please fill all the fields",
        "Some required fields are empty"
      );
      return;
    }
    if (
      (data.category == "Cash out" && data.amount > cashBalance) ||
      (data.category == "Cash in" &&
        data.amount > gcashBalance &&
        !data.isTransfer)
    ) {
      Alert.alert(
        "Insufficient balance",
        "You don't have enough balance for this transaction"
      );
      return;
    }

    if (data.isTransfer) {
      if (
        (data.payment == "Gcash" && data.fee > gcashBalance) ||
        (data.payment == "PHP" && data.fee > cashBalance) ||
        (data.category == "Cash out" && data.amount > gcashBalance) ||
        (data.category == "Cash in" && data.amount > cashBalance)
      ) {
        Alert.alert(
          "Insufficient balance",
          "You don't have enough balance for this transaction"
        );
        return;
      }
    }
    realm.write(() => {
      !editdata
        ? realm.create(
            "GcashTransactions",
            GcashTransactions.generate({ ...data, userId: user.id })
          )
        : realm.create(
            "GcashTransactions",
            {
              ...data,
              amount: +data.amount,
              userId: user.id,
              _id: data._id,
              fee: +data.fee,
              updatedAt: today,
              updatedBy: user.id,
            },
            true
          );
    });
    unset();
  };

  const selectoptions = ["Cash in", "Cash out", "Load", "Others"];
  const unset = () => {
    visible ? setVisible(false) : null;
    setDate(today);
    setData({ date: format(today, "MMM dd, yyyy") });
    setFee(0);
    editdata ? setEditData() : null;
  };

  const defaultData = (property) => {
    if (property == "date") {
      return editdata ? new Date(editdata[property]) : today;
    }

    return editdata ? editdata[property] : "";
  };
  const calculateFee = (data) => {
    let computedfee = 0;
    if (
      (data.category == "Cash in" || data.category == "Cash out") &&
      +data.amount
    ) {
      let per250 = Math.floor(+data.amount / 250);
      +data.amount % 250 != 0 ? per250++ : per250;

      computedfee = per250 * 5;
      setFee(computedfee);
    } else if (data.category == "Load" && +data.amount) {
      if (data.load == "Globe") {
        computedfee = 3;
        setFee(computedfee);
      } else if (data.load == "Other") {
        computedfee = +data.amount * 0.02 + 3;
        setFee(computedfee);
      }
    } else {
      setFee(0);
      computedfee = 0;
    }
    return computedfee;
  };

  return (
    <View className=" h-10">
      <Modal
        style={{ flex: 1 }}
        visible={editdata ? true : visible ? true : false}
        backdropStyle={styles.backdrop}
      >
        <Card
          disabled={true}
          style={{
            flex: 1,
            width: 300,
            rowGap: 15,
            padding: 5,
            borderRadius: 10,
          }}
          header={() => (
            <View
              className="flex flex-row item-center justify-between px-5"
              style={{ alignContent: "center", alignItems: "center" }}
            >
              <View>
                <Text category="h5">
                  {`${
                    data.isTransfer
                      ? "Transfer"
                      : data.category ?? editdata?.category ?? "New Record"
                  }`}
                </Text>
              </View>
              <View>
                <CheckBox
                  style={{ flexDirection: "column", alignSelf: "flex-end" }}
                  checked={data.isTransfer}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      isTransfer: e,
                      description: e ? "Transfer" : null,
                      category: null,
                    }));
                  }}
                >
                  Transfer
                </CheckBox>
              </View>
            </View>
          )}
          footer={() => (
            <View className="flex flex-row justify-center items-center gap-12 p-3 h-[120px]">
              <Button
                appearance="outline"
                onPress={() => {
                  unset();
                }}
              >
                CANCEL
              </Button>
              <Button style={{ width: 100 }} onPress={() => checkValues(data)}>
                {editdata ? "EDIT" : "SAVE"}
              </Button>
            </View>
          )}
        >
          <View className="h-auto space-y-3 ">
            <View style={{ rowGap: 20 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {data.isTransfer && (
                  <Select
                    style={{ flex: 1 }}
                    value={data.category}
                    label="Select transfer"
                    onSelect={(e) => {
                      if (e.row == 0) {
                        setData((prev) => ({
                          ...prev,
                          category: "Cash out",
                        }));
                      } else {
                        setData((prev) => ({
                          ...prev,

                          category: "Cash in",
                        }));
                      }
                    }}
                  >
                    <SelectItem title="Cash out" />
                    <SelectItem title="Cash in" />
                  </Select>
                )}
                {!data.isTransfer && (
                  <Select
                    placeholder={
                      editdata && editdata?.category == "Load"
                        ? `${editdata?.category + `   (${editdata?.load})`}`
                        : editdata?.category ?? data.category ?? "Select type"
                    }
                    label="Type"
                    value={
                      data.category == "Load" || editdata?.category == "Load"
                        ? `${data.category}   (${data.load})` ||
                          `${editdata.category}   (${editdata.load})`
                        : data.category
                    }
                    onSelect={(index) => {
                      setData((prev) => ({
                        ...prev,
                        index: index.section,
                        category: selectoptions[index.section],
                        fee: calculateFee({
                          category: selectoptions[index.section],
                          amount: prev.amount,
                        }),
                      }));
                    }}
                    style={{ flex: 1 }}
                  >
                    {selectoptions.map((item, index) => {
                      if (item == "Load") {
                        return (
                          <OverflowMenu
                            onSelect={(sel) => {
                              let newdata = {};
                              if (sel.row == 0) {
                                newdata = {
                                  index: 2,
                                  category: "Load",
                                  load: "Globe",
                                };
                              } else {
                                newdata = {
                                  index: 2,
                                  category: "Load",
                                  load: "Other",
                                };
                              }
                              setData((prev) => ({
                                ...prev,
                                ...newdata,
                              }));
                              setData((prev) => ({
                                ...prev,
                                fee: calculateFee(prev),
                              }));
                              setLoadOptions(false);
                            }}
                            style={{ width: 120, zIndex: 1000 }}
                            key={index}
                            visible={loadOptions}
                            placement={"right"}
                            anchor={() => (
                              <View style={{ width: 140 }} key={index}>
                                <SelectItem
                                  title={item}
                                  key={index}
                                  onPress={() => {
                                    setLoadOptions(true);
                                  }}
                                />
                                <Divider />
                              </View>
                            )}
                            onBackdropPress={() => {
                              setLoadOptions(false);
                            }}
                          >
                            <MenuItem title="Globe" />
                            <Divider />
                            <MenuItem title="Other" />
                          </OverflowMenu>
                        );
                      }
                      return (
                        <View key={index}>
                          <SelectItem title={item} key={index} />
                          <Divider />
                        </View>
                      );
                    })}
                  </Select>
                )}
              </View>
              <Input
                style={{
                  flex: 1,
                  height: 50,
                  borderColor: "black",
                  borderWidth: 1,
                }}
                disabled={data.isTransfer ? true : false}
                defaultValue={
                  data.isTransfer
                    ? "Transfer"
                    : defaultData("description") ?? null
                }
                placeholder="Enter details"
                label="Description"
                multiline={true}
                accessoryRight={(props) => {
                  return (
                    <Icon {...props} name="list">
                      Today
                    </Icon>
                  );
                }}
                onChangeText={(nextValue) =>
                  setData((prev) => ({ ...prev, description: nextValue }))
                }
              />

              <Datepicker
                date={date}
                onSelect={(nextDate) => {
                  setDate(nextDate),
                    setData((prev) => ({
                      ...prev,
                      date: nextDate,
                    }));
                }}
                accessoryRight={(props) => {
                  return (
                    <Icon {...props} name="calendar">
                      Today
                    </Icon>
                  );
                }}
                placeholder={"Pick Date"}
                label="Date"
                placement="right end"
                backdropStyle={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: 5,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  style={{
                    width: 150,
                  }}
                  defaultValue={defaultData("amount")?.toString()}
                  placeholder="Enter amount"
                  label="Amount"
                  keyboardType="numeric"
                  onChangeText={(nextValue) => {
                    setData((prev) => ({
                      ...prev,
                      amount: nextValue,
                    }));

                    setData((prev) => ({
                      ...prev,
                      fee: calculateFee(prev),
                    }));
                  }}
                  // accessoryRight={(props) => (
                  //   <Icon name="money" {...props} pack="fontawesome" />
                  // )}
                />
                <Input
                  style={{
                    width: 80,
                  }}
                  defaultValue={
                    fee?.toString() ?? editdata?.fee?.toString() ?? null
                  }
                  placeholder="Fee"
                  label={"Fee"}
                  maxLength={5}
                  keyboardType="numeric"
                  onChangeText={(nextValue) =>
                    setData((prev) => ({ ...prev, fee: nextValue }))
                  }
                />
              </View>
              <Select
                placeholder={data.payment ?? "Select payment"}
                value={data.payment ?? null}
                onSelect={(sel) => {
                  sel.row == 0
                    ? setData((prev) => ({ ...prev, payment: "PHP" }))
                    : setData((prev) => ({ ...prev, payment: "Gcash" }));
                }}
                label="Fee payment"
                style={{ flex: 1 }}
              >
                <SelectItem title="PHP" />
                <SelectItem title="Gcash" />
              </Select>
            </View>
          </View>
        </Card>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    padding: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
