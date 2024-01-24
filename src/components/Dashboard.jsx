import { View } from "react-native";
import {
  TopNavigation,
  Text,
  Layout,
  Divider,
  Icon,
  TopNavigationAction,
  Avatar,
  Button,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";

import profile from "../../assets/avatar.png";
import { useState, useContext, useEffect } from "react";

import { ModalDialog } from "./Modal";

import Total from "./Total";

import * as SecureStore from "expo-secure-store";

import { ThemeContext } from "../lib/theme-context";
import Balance from "./Balance";

import { useSubscribe, useTotalCashinCashoutFees } from "../lib/hooks/useTotal";

import { useTotalGcashCashBalance } from "../lib/hooks/useTotal";
import { ProfileImage } from "../lib/realm";

import { useUser, useRealm, useEmailPasswordAuth } from "@realm/react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Homepage from "./Homepage";
import SplashVideo from "./SplashVideo";
// import { getTheme, updateTheme } from "../lib/sqlite";

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [morevisible, setMoreVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const themeContext = useContext(ThemeContext);
  const { gcashSub, capitalSub, addCapitalSub, profilePicSub } = useSubscribe();
  const realm = useRealm();
  const user = useUser();
  const { logOut } = useEmailPasswordAuth();

  const { cashintotal, cashintotalfee, cashouttotal, cashouttotalfee } =
    useTotalCashinCashoutFees();

  useEffect(() => {
    const createSubscription = async () => {
      await gcashSub.subscribe({
        name: "gcashtransactions",
      });
      await capitalSub.subscribe({
        name: "capitaltransactions",
      });
      await addCapitalSub.subscribe({
        name: "addcapital",
      });
      await profilePicSub.subscribe({
        name: "profilepic",
      });
    };

    createSubscription().catch(console.log);
  }, []);

  // setProfileImg(profilePicSub.filtered("userId == $0", user.id));
  const defaultprofile = profilePicSub.filtered("userId==$0", user.id)[0] ?? {};

  const { totalCashBalance, totalGcashBalance } = useTotalGcashCashBalance();
  const balanceMap = [
    { label: "Gcash", addTo: "Gcash", balance: totalGcashBalance },
    { label: "PHP", addTo: "Cash", balance: totalCashBalance },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Save the image to Realm
      const imgdata = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      realm.write(() => {
        realm.create(
          ProfileImage,
          {
            ...defaultprofile,
            userId: user.id,
            imgUri: imgdata,
          },
          true
        );
      });
    }
  };

  useEffect(() => {
    async function getTheme() {
      const usertheme = await SecureStore.getItemAsync("usertheme");
      return usertheme;
    }
    getTheme().then((res) => {
      if (res != themeContext.deftheme) {
        themeContext.toggleTheme();
      }
    });
  }, []);

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isFinished && <SplashVideo setIsFinished={setIsFinished} />}
      {isFinished && (
        <>
          <OverflowMenu
            visible={morevisible}
            placement={"bottom end"}
            onBackdropPress={() => setMoreVisible(false)}
            anchor={() => {
              return <View className="w-full selection:absolute"></View>;
            }}
            onSelect={(index) => {
              if (index.row == 0) {
                logOut();
              }
            }}
          >
            <MenuItem title="Logout" />
          </OverflowMenu>
          <TopNavigation
            accessoryLeft={(props) => {
              return (
                <View className="flex flex-row items-center justify-center  p-3">
                  <Avatar
                    source={
                      defaultprofile?.imgUri
                        ? {
                            uri: `data:image/png;base64,${defaultprofile.imgUri}`,
                          }
                        : profile
                    }
                    size="giant"
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "contain",
                    }}
                  />
                  <Button
                    onPress={() => {
                      pickImage();
                    }}
                    style={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                      left: -18,
                      bottom: -18,
                    }}
                    size="tiny"
                    accessoryRight={() => (
                      <Icon
                        name="edit-3"
                        {...props}
                        pack="feather"
                        style={{
                          height: 22,
                          color: "#9595DB",
                        }}
                      />
                    )}
                  ></Button>

                  <Text category="s1" style={{ fontSize: 14, left: -10 }}>
                    {user.profile.email}
                  </Text>
                </View>
              );
            }}
            style={{
              height: 80,
            }}
            accessoryRight={() => (
              <>
                <TopNavigationAction
                  icon={(props) => (
                    <View className="flex flex-row" style={{ gap: 15 }}>
                      <Icon
                        style={{ backgroundColor: "black" }}
                        name={themeContext.deftheme == "light" ? "sun" : "moon"}
                        {...props}
                        onPress={async () => {
                          // await updateTheme(
                          //   user.id,
                          //   themeContext.deftheme == "dark" ? "light" : "dark"
                          // );
                          themeContext.toggleTheme();
                          await SecureStore.setItemAsync(
                            "usertheme",
                            themeContext.deftheme == "dark" ? "light" : "dark"
                          );
                        }}
                      />
                      <Icon
                        style={{ backgroundColor: "black" }}
                        name={"more-vertical-outline"}
                        {...props}
                        onPress={() => {
                          setMoreVisible(true);
                        }}
                      />
                    </View>
                  )}
                />
              </>
            )}
          />
          <View className="h-auto flex w-full flex-row space-x-3 gap-3 items-end justify-evenly pb-3">
            <View className="flex flex-row w-full justify-evenly pb-3">
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingHorizontal: 15,

                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 15 }}>
                    {balanceMap.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text
                          category="p1"
                          status="info"
                          style={{
                            margin: "auto",
                            fontWeight: "800",
                            fontSize: 14,
                          }}
                        >
                          {item.label}:
                        </Text>
                        <Balance
                          label={item.label}
                          addTo={item.addTo}
                          balance={item.balance}
                        />
                      </View>
                    ))}
                  </View>
                </View>

                <Button
                  style={{ width: 45, height: 40 }}
                  onPress={() => setVisible(true)}
                  accessoryLeft={(props) => <Icon {...props} name="plus" />}
                  size="small"
                  // style={{ height: "100%" }}
                />
              </View>
              <View>
                {visible && (
                  <ModalDialog visible={visible} setVisible={setVisible} />
                )}
              </View>
            </View>
          </View>
          <Divider />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 8,
              gap: 10,
            }}
          >
            <Total
              records={{
                category: "Cash in",
                total: cashintotal,
                totalfee: cashintotalfee,
              }}
            />
            <Total
              records={{
                category: "Cash out",
                total: cashouttotal,
                totalfee: cashouttotalfee,
              }}
            />
          </View>
          <Homepage />
        </>
      )}
    </Layout>
  );
}
