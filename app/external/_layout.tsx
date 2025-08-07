import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';



const Layout = () => {
  return (
   <Stack>
   <Stack.Screen
        name="EditNote"
        options={{ presentation: "modal", title: "Edit Note", headerShown: false }}
      />
      <Stack.Screen
        name="AddContact"
        options={{ presentation: "modal", title: "Add Contact", headerShown: false }}
      />
      <Stack.Screen
        name="NOK"
        options={{ presentation: "modal", title: "Next of Kin", headerShown: false }}
      />       
      <Stack.Screen
        name="AddVault"
        options={{ presentation: "modal", title: "Vault", headerShown: false }}
      />       

          {/* <Stack.Screen name='sub/map/StartTrip' 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name='sub/SearchRequest/SRtwo' /> */}

   </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})