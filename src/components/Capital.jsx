import { Layout, Text, TopNavigation, Avatar } from "@ui-kitten/components";
import gcash from "../../assets/g.png";
import { ListAccessoriesShowcase } from "./EntryList";
import { Capital } from "../lib/realm";
import { View } from "react-native";
import { useState } from "react";
import { useQuery } from "@realm/react";

import { useSubscribe } from "../lib/hooks/useTotal";
import { CapitalModal } from "./CapitalModal";
import Total from "./Total";

export default function CapitalList() {
  const capital = useSubscribe().addCapitalSub;
  const [editdata, setEditData] = useState();

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        title={() => {
          return (
            <View className="flex flex-row items-center justify-center gap-2 p-3">
              <Avatar
                source={gcash}
                size="giant"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                }}
              />
              <Text category="h5">Tracker</Text>
            </View>
          );
        }}
        accessoryRight={() => {
          return (
            <View>
              <Total
                records={{ total: capital.sum("amount"), isCapital: true }}
              />
            </View>
          );
        }}
        style={{
          height: 80,
        }}
      />
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
