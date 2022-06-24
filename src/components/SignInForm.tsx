import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Palette from '../styles/palette';
import SBButton from './SBButton';
import SBIcon from './SBIcon';
import SBText from './SBText';
import SBTextInput from './SBTextInput';

type Props = {
  userId: string;
  accessToken?: string;
  onChange: (value: { userId: string; accessToken?: string }) => void;
  onSubmit: (value: { userId: string; accessToken?: string }) => void;
  containerStyle?: StyleProp<ViewStyle>;
};
const SignInForm = ({ userId, accessToken, onSubmit, onChange, containerStyle }: Props) => {
  return (
    <View style={containerStyle}>
      <View style={styles.logoContainer}>
        <SBIcon icon={'Sendbird'} size={48} />
        <SBText style={styles.logoTitle}>Sendbird Calls</SBText>
      </View>
      <SBTextInput
        value={userId}
        onChangeText={(userId) => onChange({ userId, accessToken })}
        placeholder={'User ID'}
        style={styles.input}
      />
      <SBTextInput
        value={accessToken}
        onChangeText={(accessToken) => onChange({ userId, accessToken })}
        placeholder={'Access token (optional)'}
        style={styles.input}
      />
      <SBButton style={styles.button} onPress={() => onSubmit({ userId, accessToken })}>
        {'Sign in'}
      </SBButton>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 34,
    marginTop: 48,
  },
  logoTitle: {
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 24,
    color: Palette.onBackgroundLight01,
  },
  input: {
    height: 56,
    marginBottom: 16,
  },
  button: {
    height: 48,
    borderRadius: 4,
    marginTop: 16,
  },
});

export default SignInForm;
