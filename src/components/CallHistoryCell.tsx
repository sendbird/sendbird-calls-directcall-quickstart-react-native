import dayjs from 'dayjs';
import React, { FC, useMemo } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import SBText from './SBText';
import IconAssets from '../assets';
import Palette from '../styles/palette';
import { CallHistory } from '../libs/CallHistoryManager';
import SBIcon, { IconNames } from './SBIcon';

const CallHistoryCell: FC<{ history: CallHistory; onDial: (userId: string, isVideoCall: boolean) => void }> = ({
  history,
  onDial,
}) => {
  const remoteUser = history.remoteUser;
  const profileSource = remoteUser?.profileUrl ? { uri: remoteUser.profileUrl } : IconAssets.Avatar;

  const icon: IconNames = useMemo(() => {
    if (history.isVideoCall) {
      return history.isOutgoing ? 'CallVideoOutgoingFilled' : 'CallVideoIncomingFilled';
    } else {
      return history.isOutgoing ? 'CallVoiceOutgoingFilled' : 'CallVoiceIncomingFilled';
    }
  }, [history]);

  return (
    <TouchableOpacity
      onPress={() => onDial(history.remoteUser?.userId ?? 'unknown', history.isVideoCall)}
      style={styles.cellContainer}
    >
      <SBIcon icon={icon} size={20} containerStyle={{ marginRight: 8 }} />
      <Image source={profileSource} style={styles.cellProfile} />
      <View style={styles.cellInfo}>
        <View style={{ flex: 1 }}>
          <SBText subtitle1 color={Palette.onBackgroundLight01} numberOfLines={2}>
            {remoteUser?.nickname || '—'}
          </SBText>
          <SBText body3 color={Palette.onBackgroundLight03} numberOfLines={1}>
            {`User ID: ${remoteUser?.userId}`}
          </SBText>
          <View>
            <SBText body3 color={Palette.onBackgroundLight03} numberOfLines={2}>
              {[history.endResult, history.duration].join(' · ')}
            </SBText>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <SBText caption2 style={{ marginBottom: 12 }}>
            {dayjs(history.startedAt).format('YYYY/MM/DD H:mm')}
          </SBText>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={{ marginRight: 12 }}
              disabled={!history.remoteUser}
              onPress={() => onDial(history.remoteUser?.userId ?? 'unknown', true)}
            >
              {({ pressed }) => {
                return (
                  <SBIcon
                    size={32}
                    icon={(() => {
                      if (!history.remoteUser) return 'btnCallVideoTertiaryDisabled';
                      if (pressed) return 'btnCallVideoTertiaryPressed';
                      return 'btnCallVideoTertiary';
                    })()}
                  />
                );
              }}
            </Pressable>
            <Pressable
              disabled={!history.remoteUser}
              onPress={() => onDial(history.remoteUser?.userId ?? 'unknown', false)}
            >
              {({ pressed }) => {
                return (
                  <SBIcon
                    size={32}
                    icon={(() => {
                      if (!history.remoteUser) return 'btnCallVoiceTertiaryDisabled';
                      if (pressed) return 'btnCallVoiceTertiaryPressed';
                      return 'btnCallVoiceTertiary';
                    })()}
                  />
                );
              }}
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    paddingLeft: 12,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellProfile: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  cellInfo: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: Palette.background100,
    borderBottomWidth: 1,
  },
});

export default React.memo(CallHistoryCell);
