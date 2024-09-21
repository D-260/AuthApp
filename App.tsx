import React, { useEffect, useReducer, useState, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';
import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';

import { AuthContext } from './components/context';
import RootStackScreen from './screens/RootStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

type LoginState = {
  isLoading: boolean;
  userName: string | null;
  userToken: string | null;
};

type AuthContextType = {
  signIn: (foundUser: any) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: () => void;
  toggleTheme: () => void;
};

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const initialLoginState: LoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState: LoginState, action: { type: string; token?: string; id?: string }) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token ?? null,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id ?? null,
          userToken: action.token ?? null,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id ?? null,
          userToken: action.token ?? null,
          isLoading: false,
        };
      default:
        return prevState;
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo<AuthContextType>(
    () => ({
      signIn: async (foundUser) => {
        const userToken = String(foundUser[0].userToken);
        const userName = foundUser[0].username;

        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGIN', id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGOUT' });
      },
      signUp: () => {
        // Implement sign up logic here
      },
      toggleTheme: () => {
        setIsDarkTheme((isDark) => !isDark);
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken: string | null = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          {loginState.userToken !== null ? (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              <Drawer.Screen name="SupportScreen" component={SupportScreen} />
              <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
              <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
            </Drawer.Navigator>
          ) : (
            <RootStackScreen />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
};

export default App;
