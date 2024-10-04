import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Profile = () => {
  return (
    <View>
      <Text style={{color: 'red', marginTop: 100, fontSize: 30}}>Profile</Text>
      <Link href="/" className='text-blue-600'>Home</Link>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})