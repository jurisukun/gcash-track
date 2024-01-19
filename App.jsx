// if (global.crypto === undefined) {
//   global.crypto = require("react-native-get-random-values");
// }
import "react-native-get-random-values";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { FontAwesomeIconsPack } from "./assets/icons/font-awesome";
// import { default as theme } from "./custom-theme.json"; // <-- Import app theme
import { AppNavigator } from "./src/components/Drawer";
import { initDatabase } from "./src/lib/sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContext } from "./src/lib/theme-context";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RealmProvider, Realm } from "@realm/react";
// import { RealmProvider } from "./src/lib/realm";
import {
  GcashTransactions,
  CapitalTransactions,
  CustomUserData,
  Capital,
} from "./src/lib/realm";
import { AppProvider, UserProvider } from "@realm/react";
import { RealmFallback } from "./src/components/RealmFallback";

import LoginRegisterinputs from "./src/components/auth/LoginRegisterinputs";

initDatabase();
const queryClient = new QueryClient();

export default function App() {
  const [deftheme, setDefTheme] = useState("dark");

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

  return (
    <AppProvider id={"gcash-tracker-app-hfwbl"}>
      <QueryClientProvider client={queryClient}>
        <IconRegistry icons={[EvaIconsPack, FontAwesomeIconsPack]} />
        {deftheme && (
          <ThemeContext.Provider value={{ deftheme, toggleTheme, setDefTheme }}>
            <ApplicationProvider {...eva} theme={eva[deftheme]}>
              <StatusBar
                style={deftheme == "light" ? "dark" : "light"}
                backgroundColor={
                  deftheme == "light"
                    ? "#fff"
                    : eva[deftheme]["color-basic-800"]
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
        )}
      </QueryClientProvider>
    </AppProvider>
  );
}
