import React, { useEffect } from "react";
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
} from "@ui-kitten/components";
import { Alert } from "react-native";
import { insertRecord } from "../lib/sqlite";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format, set } from "date-fns";

export const ModalDialog = () => {
  let today = new Date();
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(today);
  const [data, setData] = React.useState({
    date: format(new Date(), "MMM dd, yyyy"),
  });
  const [fee, setFee] = React.useState(0);
  const [loadOptions, setLoadOptions] = React.useState(false);

  const queryClient = useQueryClient();

  const checkValues = (data) => {
    if (
      !data.description ||
      !data.amount ||
      !data.date ||
      !data.category ||
      !data.fee
    ) {
      Alert.alert(
        "Please fill all the fields",
        "Some required fields are empty"
      );
      console.log("incomplete", data);
      return;
    }

    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: insertRecord,
    onSuccess: (data, variables) => {
      setVisible(false);

      queryClient.setQueryData(["fetchrecords"], (oldData) => [
        ...oldData,
        {
          ...variables,
          category:
            variables?.category == "Load"
              ? `${variables.category}   (${variables.load})`
              : variables.category,
        },
      ]);
      setData({ date: format(new Date(), "MMM dd, yyyy") });
      setDate(today);
    },
    onError: (error, variables) => {
      Alert.alert("Error", error.message);
    },
  });

  const selectoptions = ["Cash in", "Cash out", "Load", "Others"];

  const calculateFee = (data) => {
    let computedfee = 0;
    if (
      (data.category == "Cash in" || data.category == "Cash out") &&
      data.amount
    ) {
      let per250 = Math.floor(data.amount / 250);
      data.amount % 250 != 0 ? per250++ : per250;

      computedfee = per250 * 5;
      setFee(computedfee);
    } else if (data.category == "Load" && data.amount) {
      console.log("else");
      console.log(data);
      if (data.load == "Globe") {
        computedfee = 3;
        setFee(computedfee);
      } else {
        computedfee = data.amount * 0.02 + 3;
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
      <Button
        onPress={() => setVisible(true)}
        accessoryLeft={(props) => <Icon {...props} name="plus" />}
        size="small"
        style={{ height: "100%" }}
      >
        Add New
      </Button>

      <Modal
        style={{ flex: 1 }}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card
          disabled={true}
          style={{
            flex: 1,
            width: 300,
            rowGap: 20,
            padding: 5,
            borderRadius: 10,
          }}
          header={() => (
            <View className="flex item-center justify-center px-5 h-6">
              <Text category="h5">
                {selectoptions[data.index] ?? "New Record"}
              </Text>
            </View>
          )}
          footer={() => (
            <View className="flex flex-row justify-center items-center gap-12 p-3 h-[120px]">
              <Button
                appearance="outline"
                onPress={() => {
                  setVisible(false);
                  setDate(today);
                  setData({ date: format(today, "MMM dd, yyyy") });
                  setFee(0);
                }}
              >
                CANCEL
              </Button>
              <Button style={{ width: 100 }} onPress={() => checkValues(data)}>
                SAVE
              </Button>
            </View>
          )}
        >
          <View className="h-auto space-y-3 ">
            <View style={{ rowGap: 20 }}>
              <Input
                style={{
                  flex: 1,
                  height: 50,
                  borderColor: "black",
                  borderWidth: 1,
                }}
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
                      date: format(nextDate, "MMM dd, yyyy"),
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
              <View className="flex flex-row gap-3">
                <Input
                  style={{
                    flex: 1,
                    height: 50,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                  placeholder="Enter amount"
                  label="Amount"
                  keyboardType="numeric"
                  onChangeText={(nextValue) => {
                    setData((prev) => ({
                      ...prev,
                      amount: nextValue,
                      fee: calculateFee({
                        amount: nextValue,
                        category: selectoptions[prev.index],
                      }),
                    }));
                  }}
                  // accessoryRight={(props) => (
                  //   <Icon name="money" {...props} pack="fontawesome" />
                  // )}
                />
                <Input
                  style={{
                    width: 75,
                  }}
                  defaultValue={fee.toString()}
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
                placeholder="Select category"
                label="Type"
                value={
                  data.category == "Load"
                    ? `${data.category}   (${data.load})`
                    : selectoptions[data.index]
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
              >
                {selectoptions.map((item, index) => {
                  if (item == "Load") {
                    return (
                      <OverflowMenu
                        onSelect={(sel) => {
                          if (sel.row == 0) {
                            const newdata = {
                              ...data,
                              index: 2,
                              category: "Load",
                              load: "Globe",
                            };
                            setData((prev) => ({
                              ...prev,
                              ...newdata,
                              fee: calculateFee(newdata),
                            }));
                          } else {
                            const newdata = {
                              ...data,
                              index: 2,
                              category: "Load",
                              load: "Other",
                            };
                            setData((prev) => ({
                              ...prev,
                              ...newdata,
                              fee: calculateFee(newdata),
                            }));
                          }

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
