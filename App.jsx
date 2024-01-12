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
import { RealmProvider } from "@realm/react";
import { GcashTransactions } from "./src/lib/realm";

initDatabase();
const queryClient = new QueryClient();

export default function App() {
  const [deftheme, setDefTheme] = useState("dark");

  const toggleTheme = () => {
    const nextTheme = deftheme === "light" ? "dark" : "light";
    setDefTheme(nextTheme);
  };

  return (
    <RealmProvider schema={[GcashTransactions]}>
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
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </ApplicationProvider>
          </ThemeContext.Provider>
        )}
      </QueryClientProvider>
    </RealmProvider>
  );
}
