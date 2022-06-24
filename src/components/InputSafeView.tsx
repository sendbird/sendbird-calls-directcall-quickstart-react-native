import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable } from 'react-native';

import type { ChildrenProps } from '../types/props';

const InputSafeView: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding' })}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        {children}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default InputSafeView;
