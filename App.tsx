import React, { useEffect } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
// import { DriverTracker } from './src/DriverTracker/DriverTracker';
import { addDataToDb } from './src/utils/db/sqliteConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DriverTracker } from './src/DriverTracker/DriverTracker';

export default function App() {

  useEffect(() => {
    // on App starts, create db table if not existed
    addDataToDb();
    // subscribe to Netinfo
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    // Unsubscribe
    return () => {
      // do something with db
      unsubscribe();
    }
  }, [])
  const Switch = createStackNavigator();
  return (
    <NavigationContainer fallback={<Text>Loading…</Text>}>
      <Switch.Navigator >
        <Switch.Screen name="main" component={DriverTracker} />
      </Switch.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
