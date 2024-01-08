import React from 'react';
import { Button, Icon, List, ListItem } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';



const data = new Array(38).fill({
  title: 'Title for Item',
  description: 'Description for Item',
});

export const ListAccessoriesShowcase = () => {

  const renderItemAccessory = () => (
    <Button size='tiny'>
FOLLOW
    </Button>
  );

  const renderItemIcon = (props) => (
    <Icon
      {...props}
      name='person'
    />
  );

  const renderItem = ({ item, index })=> (
    <ListItem
      title={item.title}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  return (
    <List
      style={styles.container}
      data={data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
   flex:1,
    width:'100%',
  },
});