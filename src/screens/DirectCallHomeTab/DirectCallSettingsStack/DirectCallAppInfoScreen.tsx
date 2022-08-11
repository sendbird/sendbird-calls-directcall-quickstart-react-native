import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import SBText from '../../../components/SBText';
import Palette from '../../../styles/palette';

const DirectCallAppInfoScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <SBText body2>Name</SBText>

        <SBText body1 style={{ marginTop: 4 }}>
          Voice & Video
        </SBText>
      </View>

      <View style={styles.info}>
        <SBText body2>ID</SBText>
        <SBText body1 style={{ marginTop: 4 }}>
          {SendbirdCalls.applicationId}
        </SBText>
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
  info: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
    paddingVertical: 16,
  },
});

export default DirectCallAppInfoScreen;
