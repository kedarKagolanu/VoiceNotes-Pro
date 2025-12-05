import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import NotesScreen from '@/screens/NotesScreen';
import FoldersScreen from '@/screens/FoldersScreen';
import SearchScreen from '@/screens/SearchScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import NoteEditorScreen from '@/screens/NoteEditorScreen';
import FolderSelectorScreen from '@/screens/FolderSelectorScreen';
import {theme} from '@/theme';
import {MainTabParamList, RootStackParamList} from '@/types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Notes':
              iconName = 'note';
              break;
            case 'Folders':
              iconName = 'folder';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'note';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{
          title: 'Notes',
        }}
      />
      <Tab.Screen 
        name="Folders" 
        component={FoldersScreen}
        options={{
          title: 'Folders',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="NoteEditor" 
        component={NoteEditorScreen}
        options={{
          title: 'Edit Note',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="FolderSelector" 
        component={FolderSelectorScreen}
        options={{
          title: 'Select Folder',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainTabNavigator;