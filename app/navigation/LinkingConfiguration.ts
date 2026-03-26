import { LinkingOptions } from '@react-navigation/native';
import { createURL } from 'expo-linking';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: 'home',
          History: 'history',
          Settings: 'settings',
        },
      },
      NotFound: '*',
    },
  },
};

export default linking;
