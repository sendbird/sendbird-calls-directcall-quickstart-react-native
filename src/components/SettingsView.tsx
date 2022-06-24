import React, { FC } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import IconAssets from '../assets';
import Palette from '../styles/palette';
import SBIcon from './SBIcon';
import SBText from './SBText';

type Props = {
  userId: string;
  nickname: string;
  profileUrl: string;

  onPressApplicationInformation: () => void;
  onPressSignOut: () => void;
};

const SettingsView: FC<Props> = ({ userId, nickname, profileUrl, onPressSignOut, onPressApplicationInformation }) => {
  const profileSource = profileUrl ? { uri: profileUrl } : IconAssets.Avatar;
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={profileSource} style={styles.profileImg} />
        <SBText subtitle1 style={{ marginTop: 8, marginBottom: 4 }}>
          {nickname}
        </SBText>
        <SBText caption2>User ID: {userId}</SBText>
      </View>

      <View style={styles.list}>
        <Pressable style={styles.item} onPress={onPressApplicationInformation}>
          <View style={styles.itemContent}>
            <SBIcon icon={'Info'} color={Palette.primary300} containerStyle={{ marginRight: 16 }} />
            <SBText subtitle2>{'Application information'}</SBText>
          </View>
          <SBIcon icon={'ShevronRight'} color={Palette.background600} />
        </Pressable>

        <Pressable style={styles.item} onPress={onPressSignOut}>
          <SBIcon icon={'Leave'} color={Palette.error300} containerStyle={{ marginRight: 16 }} />
          <SBText subtitle2>Sign out</SBText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Palette.background50,
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default SettingsView;
