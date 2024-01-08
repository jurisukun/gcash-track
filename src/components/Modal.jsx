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
} from "@ui-kitten/components";
import { Alert } from "react-native";
import { insertRecord } from "../lib/sqlite";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

export const ModalDialog = () => {
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [data, setData] = React.useState({ date });

  const queryClient = useQueryClient();

  const checkValues = (data) => {
    if (!data.description || !data.amount || !data.date || !data.category) {
      Alert.alert(
        "Please fill all the fields",
        "Some required fields are empty"
      );
      return;
    }

    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: insertRecord,
    onSuccess: (data, variables) => {
      setVisible(false);
      console.log("data", data, "variables", variables);
      queryClient.setQueryData(["fetchrecords"], (oldData) => [
        ...oldData,
        variables,
      ]);
    },
    onError: (error, variables) => {
      Alert.alert("Error", error.message);
    },
  });

  const selectoptions = ["Cash in", "Cash out", "Load", "Others"];

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
              <Text category="h5">Cash in</Text>
            </View>
          )}
          footer={() => (
            <View className="flex flex-row justify-center items-center gap-12 p-3 h-[120px]">
              <Button
                appearance="outline"
                onPress={() => {
                  setVisible(false);
                  setData({});
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
                  setData({ ...data, description: nextValue })
                }
              />

              <Datepicker
                date={date}
                onSelect={(nextDate) => {
                  setDate(nextDate),
                    setData({
                      ...data,
                      date: format(nextDate, "MMM dd, yyyyy"),
                    });
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
                onChangeText={(nextValue) =>
                  setData({ ...data, amount: nextValue })
                }
                accessoryRight={(props) => (
                  <Icon name="money" {...props} pack="fontawesome" />
                )}
              />
              <Select
                placeholder="Select category"
                label="Type"
                value={selectoptions[data.index]}
                onSelect={(index) => {
                  setData({
                    ...data,
                    index: index.row,
                    category: selectoptions[index.row],
                  });
                }}
              >
                {selectoptions.map((item, index) => (
                  <SelectItem title={item} key={index} />
                ))}
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
