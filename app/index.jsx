import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const Index = () => {
  return (
    <View>
      <View className="flex items-center justify-center m-auto mt-40">
      <Text className="text-3xl font-pbold text-red-600">Aora!</Text>
      <StatusBar style="auto" />
      <Link href="/home" className='text-blue-600 '>Profile</Link>
    </View>
    </View>
  )
}

export default Index

