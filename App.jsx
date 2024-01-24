// if (global.crypto === undefined) {
//   global.crypto = require("react-native-get-random-values");
// }
import "react-native-get-random-values";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { FontAwesomeIconsPack } from "./assets/icons/font-awesome";
import { FeatherIconsPack } from "./assets/icons/feather-icons";
import { IonicIconsPack } from "./assets/icons/ionicons";
import { default as customtheme } from "./custom-theme.json"; // <-- Import app theme
import { AppNavigator } from "./src/components/Drawer";
import { themeDatabase } from "./src/lib/sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContext } from "./src/lib/theme-context";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RealmProvider, Realm } from "@realm/react";
import * as SplashScreen from "expo-splash-screen";
// import { RealmProvider } from "./src/lib/realm";
import {
  GcashTransactions,
  CapitalTransactions,
  CustomUserData,
  Capital,
  ProfileImage,
} from "./src/lib/realm";
import { AppProvider, UserProvider } from "@realm/react";
import { RealmFallback } from "./src/components/RealmFallback";

import LoginRegisterinputs from "./src/components/auth/LoginRegisterinputs";

const queryClient = new QueryClient();

export default function App() {
  const [deftheme, setDefTheme] = useState("light");

  const toggleTheme = () => {
    const nextTheme = deftheme === "light" ? "dark" : "light";
    setDefTheme(nextTheme);
  };

  const realmAccessBehavior = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately,
  };

  const syncConfigWithErrorHandling = {
    flexible: true,
    onError: (_session, error) => {
      console.log(error);
    },
    initialSubscriptions: {
      update: (subs, realm) => {
        subs.add(realm.objects("GcashTransactions"));
      },
      rerunOnOpen: true,
    },
    newRealmFileBehavior: realmAccessBehavior,
    existingRealmFileBehavior: realmAccessBehavior,
  };

  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 1000);

  return (
    <AppProvider id={"gcash-tracker-app-hfwbl"}>
      <QueryClientProvider client={queryClient}>
        <IconRegistry
          icons={[
            EvaIconsPack,
            FontAwesomeIconsPack,
            FeatherIconsPack,
            IonicIconsPack,
          ]}
        />

        <ThemeContext.Provider value={{ deftheme, toggleTheme, setDefTheme }}>
          <ApplicationProvider
            {...eva}
            theme={{ ...eva[deftheme], ...customtheme }}
          >
            <StatusBar
              style={deftheme == "light" ? "dark" : "light"}
              backgroundColor={
                deftheme == "light" ? "#fff" : eva[deftheme]["color-basic-800"]
              }
            />
            <UserProvider fallback={<LoginRegisterinputs />}>
              <RealmProvider
                fallback={<RealmFallback />}
                schema={[
                  GcashTransactions,
                  CapitalTransactions,
                  CustomUserData,
                  Capital,
                  ProfileImage,
                ]}
                sync={syncConfigWithErrorHandling}
              >
                <SafeAreaProvider>
                  <AppNavigator />
                </SafeAreaProvider>
              </RealmProvider>
            </UserProvider>
          </ApplicationProvider>
        </ThemeContext.Provider>
      </QueryClientProvider>
    </AppProvider>
  );
}
