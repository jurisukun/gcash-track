import {
  Layout,
  Text,
  TopNavigation,
  Divider,
  Icon,
} from "@ui-kitten/components";

import { ListAccessoriesShowcase } from "./EntryList";
import { Capital } from "../lib/realm";
import { View } from "react-native";
import { useState } from "react";

import { useSubscribe } from "../lib/hooks/useTotal";
import { CapitalModal } from "./CapitalModal";
import Total from "./Total";
import { useRoute } from "@react-navigation/native";

export default function CapitalList() {
  const capital = useSubscribe().addCapitalSub;
  const [editdata, setEditData] = useState();
  const route = useRoute();

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        style={{ paddingHorizontal: 20, height: 60 }}
        accessoryLeft={(props) => (
          <View
            className="flex flex-row"
            style={{ gap: 10, alignItems: "center" }}
          >
            <Text category="h5" style={{ fontWeight: "700" }}>
              {route.params.option}
            </Text>
            <Icon
              {...props}
              name={route?.params?.icon}
              pack="feather"
              fill="#CCCCFF"
              style={{
                width: 22,
                height: 22,
                margin: "auto",
                color: "#CCCCFF",
              }}
            />
          </View>
        )}
        accessoryRight={() => {
          return (
            <View>
              <Total
                records={{ total: capital.sum("amount"), isCapital: true }}
              />
            </View>
          );
        }}
      />
      <Divider />
      <ListAccessoriesShowcase
        data={capital}
        isCapital={true}
        schema={Capital}
        setEditData={setEditData}
      />
      <View>
        {editdata && (
          <CapitalModal
            editdata={editdata}
            setEditData={setEditData}
            realmSchema={Capital}
            realmSchemaName={"Capital"}
            typeOfTransaction={{
              category: editdata.category,
            }}
          />
        )}
      </View>
    </Layout>
  );
}
