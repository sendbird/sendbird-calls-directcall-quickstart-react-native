import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { DirectRouteWithParams, DirectRoutes } from './routes';
import { AsParamListBase } from '../types/navigations';

export type DirectParamListBase = AsParamListBase<DirectRouteWithParams>;
export type DirectRouteProp<T extends DirectRoutes> = RouteProp<DirectParamListBase, T>;
export type DirectNativeStackNavigationProp<T extends DirectRoutes> = NativeStackNavigationProp<DirectParamListBase, T>;

export const useDirectNavigation = <T extends DirectRoutes>() => {
  const navigation = useNavigation<DirectNativeStackNavigationProp<T>>();
  const route = useRoute<DirectRouteProp<T>>();

  return { navigation, route };
};
