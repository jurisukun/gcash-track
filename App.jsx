import { SafeAreaView } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { FontAwesomeIconsPack } from "./assets/icons/font-awesome";
import { default as theme } from "./custom-theme.json"; // <-- Import app theme
import { AppNavigator } from "./src/components/Drawer";
import { initDatabase } from "./src/lib/sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

initDatabase();

const queryClient = new QueryClient();
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <IconRegistry icons={[EvaIconsPack, FontAwesomeIconsPack]} />
        <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
          <AppNavigator />
        </ApplicationProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
