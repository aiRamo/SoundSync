import { View, Text, Button } from 'react-native'
import React from 'react'

export default function Home({navigation}) {
  return (
    <View className="flex-1 justify-center">
      <Button 
      title="Scan" 
      color="red" 
      onPress={() => 
        navigation.navigate('Scan',{})
      }
      >

      </Button>
      <Button 
      title="Audio"
      onPress={() =>
        navigation.navigate('Audio',{})
      }
      />
    </View>
  )
}


