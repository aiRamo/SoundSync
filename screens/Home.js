import { View, Text, Button } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View className="flex-1 justify-center">
      <Button title="Scan" color="red"></Button>
      <Button title="Audio"></Button>
    </View>
  )
}

export default Home;