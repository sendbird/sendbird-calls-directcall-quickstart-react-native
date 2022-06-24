import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_HEADER_HEIGHT } from '../constants';
import { useIIFE } from '../hooks/useEffectAsync';
import Palette from '../styles/palette';
import SBButton from './SBButton';
import SBIcon from './SBIcon';
import SBText from './SBText';

export enum HeaderLeftTypes {
  NONE = 'NONE',
  BACK = 'BACK',
  CANCEL = 'CANCEL',
}

interface IHeaderLeftProps {
  title: string;
  titleAlignCenter?: boolean;
  headerLeftType?: HeaderLeftTypes;
}

const Header = ({ title, titleAlignCenter, headerLeftType = HeaderLeftTypes.NONE }: IHeaderLeftProps) => {
  const { goBack, canGoBack } = useNavigation();
  const { top } = useSafeAreaInsets();

  const leftButton = useIIFE(() => {
    switch (headerLeftType) {
      case HeaderLeftTypes.BACK:
        return (
          canGoBack() && (
            <Pressable onPress={goBack}>
              <SBIcon icon={'Back'} color={Palette.primary300} containerStyle={{ marginRight: 16 }} />
            </Pressable>
          )
        );
      case HeaderLeftTypes.CANCEL:
        return (
          canGoBack() && (
            <SBButton variant={'text'} onPress={goBack}>
              {'Cancel'}
            </SBButton>
          )
        );
      default: // HeaderLeftTypes.NONE
        return null;
    }
  });

  return (
    <View style={[styles.container, { paddingTop: top, height: DEFAULT_HEADER_HEIGHT + top }]}>
      <View
        style={[
          styles.headerTitle,
          { top },
          (headerLeftType !== HeaderLeftTypes.NONE || titleAlignCenter) && { alignItems: 'center' },
        ]}
      >
        <SBText h1>{title}</SBText>
      </View>
      {leftButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background50,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
  },
  headerTitle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});

export default Header;
