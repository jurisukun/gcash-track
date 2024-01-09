import { SafeAreaView } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { FontAwesomeIconsPack } from "./assets/icons/font-awesome";
import { default as theme } from "./custom-theme.json"; // <-- Import app theme
import { AppNavigator } from "./src/components/Drawer";
import { initDatabase } from "./src/lib/sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContext } from "./src/lib/theme-context";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

initDatabase();
const queryClient = new QueryClient();

export default function App() {
  const [deftheme, setDefTheme] = useState("light");

  const toggleTheme = () => {
    const nextTheme = deftheme === "light" ? "dark" : "light";
    setDefTheme(nextTheme);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <IconRegistry icons={[EvaIconsPack, FontAwesomeIconsPack]} />
        <ThemeContext.Provider value={{ deftheme, toggleTheme }}>
          <ApplicationProvider {...eva} theme={eva[deftheme]}>
            {/* <StatusBar style="dark" /> */}
            <AppNavigator />
          </ApplicationProvider>
        </ThemeContext.Provider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
