import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Modal, Text , Input, Icon, Datepicker} from '@ui-kitten/components';
import { Alert } from 'react-native';

 
export const ModalDialog = () => {

  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [data, setData] = React.useState({});


  const checkValues = () => {
    if(!data.description || !data.amount || !data.date){
      Alert.alert('Please fill all the fields',"Some required fields are empty",)
    }
  }

  return (
    <>
      <Button onPress={() => setVisible(true)} accessoryLeft={(props)=>(<Icon {...props} name="plus"/>)}
      size='small'>Add New</Button>

     

   
     <Modal
     style={{flex:1}}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true} style={{flex:1, width:300, rowGap:20, padding:5 ,borderRadius:10}}
        header={()=><View className="flex item-center justify-center px-5 h-6">
           <Text category='h5'>
          Cash in
          </Text>
          </View> }
        footer={()=>  <View className="flex flex-row justify-center items-center gap-12 p-3 h-[120px]">

            <Button appearance='outline' onPress={() => {
              setVisible(false)
              setData({})
            }}>
              CANCEL
            </Button>
            <Button style={{width:100}} onPress={checkValues}
          >
              SAVE
            </Button>
          </View>}
        >
          <View className="h-auto space-y-3 ">
        
          <View style={{ rowGap:20}}>
            <Input
            style={{flex:1,  height:50, borderColor:'black', borderWidth:1}}
            placeholder='Enter details'
            label='Description'
            multiline={true}
             accessoryRight={(props)=>{return(<Icon  {...props} name="list">Today</Icon>)}}
             onChangeText={nextValue => setData({...data, description:nextValue})}
           
            />
            
           
            <Datepicker
        date={date}
        onSelect={nextDate => {setDate(nextDate), setData({...data, date:nextDate})}}
         accessoryRight={(props)=>{return(<Icon  {...props} name="calendar">Today</Icon>)}}
         placeholder={'Pick Date'}
        label='Date'
        placement="right end"
      
        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)', padding: 5}}
      />
             <Input
            style={{flex:1,  height:50, borderColor:'black', borderWidth:1}}
            placeholder='Enter amount'
            label='Amount'
            keyboardType='numeric'
            onChangeText={nextValue => setData({...data, amount:nextValue})}
            accessoryRight={(props)=>(<Icon name="money"  {...props} pack="fontawesome"/>)}
            />
          </View>
        
          </View>
          
         
        </Card>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    padding: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});