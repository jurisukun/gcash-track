
import { SafeAreaView } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text as TextKit } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { FontAwesomeIconsPack } from './assets/icons/font-awesome';
import { default as theme } from './custom-theme.json'; // <-- Import app theme
import { AppNavigator } from './src/components/Drawer';

import { getAllRecords, initDatabase } from './src/lib/sqlite';

export default function App() {
  initDatabase();
  getAllRecords()
  
  
  return (
    <SafeAreaView style={{flex:1}}>
      <IconRegistry  icons={[EvaIconsPack, FontAwesomeIconsPack]}/>
    <ApplicationProvider {...eva} theme={{...eva.dark, ...theme}}>
      
     <AppNavigator/>
    </ApplicationProvider>
      </SafeAreaView>
  );
}