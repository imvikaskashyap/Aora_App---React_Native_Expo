import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const User = () => {
  return (
    <View>
      <Text style={{color: 'red', marginTop: 100, fontSize: 30}} >User</Text>
      <Link href="/profile" style={{color: 'blue', marginTop:10, textDecorationLine: 'underline'}}>Profile</Link>
    </View>
  )
}

export default User

const styles = StyleSheet.create({
  component:{
    display: 'flex',
    // flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})