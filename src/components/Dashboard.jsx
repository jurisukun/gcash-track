import {View} from 'react-native';
import { TopNavigation , Text as TextKit, Layout, Button, Divider} from '@ui-kitten/components';
import { ModalDialog } from './Modal';

import { ListAccessoriesShowcase } from './EntryList';

export default function  Dashboard(){
  return(
   
    <Layout style={{flex:1, justifyContent:'center', alignItems:'center', rowGap: 3}}>
    <TopNavigation title='MyApp'/>
    <Divider/>
    <View style={{width: "100%", justifyContent:'center', alignItems:'center', paddingBottom:14}}>
      <ModalDialog/>
      </View>
      <Divider/>
       <ListAccessoriesShowcase/>
      </Layout>
    
  );
}