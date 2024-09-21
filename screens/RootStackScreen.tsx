import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screen components
import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

// Define types for the Stack navigator
export type RootStackParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
};

// Create the Stack navigator using the type
const RootStack = createStackNavigator<RootStackParamList>();

// Define the functional component with TypeScript typing
const RootStackScreen: React.FC = () => (
  <NavigationContainer>
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="SplashScreen" component={SplashScreen} />
      <RootStack.Screen name="SignInScreen" component={SignInScreen} />
      <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default RootStackScreen;
