import { DirectCallEndResult, DirectCallLog, DirectCallUser, DirectCallUserRole } from '@sendbird/calls-react-native';

import { createStorage, SimpleStorage } from './createStorage';
import JSEventEmitterType from '@sendbird/calls-react-native/lib/typescript/src/libs/JSEventEmitter';
//@ts-ignore
import JSEventEmitter from '@sendbird/calls-react-native/lib/module/libs/JSEventEmitter';

export interface CallHistory {
  callId: string;
  isOutgoing: boolean;
  isVideoCall: boolean;

  me: DirectCallUser | null;
  remoteUser: DirectCallUser | null;
  endResult: string;

  duration: string;
  startedAt: number;
}

export const asHistory = (log: DirectCallLog): CallHistory => {
  const isOutgoing = log.myRole === DirectCallUserRole.CALLER;
  const remoteUser = isOutgoing ? log.callee : log.caller;
  const me = isOutgoing ? log.caller : log.callee;

  const duration = (() => {
    if (log.endResult === DirectCallEndResult.DECLINED) return '0s';
    if (log.endResult === DirectCallEndResult.CANCELED) return '0s';
    if (log.endResult === DirectCallEndResult.OTHER_DEVICE_ACCEPTED) return '0s';
    if (log.endResult === DirectCallEndResult.ACCEPT_FAILED) return '0s';
    if (log.endResult === DirectCallEndResult.DIAL_FAILED) return '0s';
    if (log.endResult === DirectCallEndResult.NO_ANSWER) return '0s';
    if (log.endResult === DirectCallEndResult.TIMED_OUT) return '0s';

    const [h, m, s] = new Date(log.duration).toISOString().substring(11, 19).split(':');
    const hms = Object.entries({ h, m, s });
    return hms
      .reduce((prev, curr) => (Number(curr[1]) > 0 && prev.push(curr[1] + curr[0]), prev), [] as string[])
      .join(' ');
  })();

  return {
    callId: log.callId || String(Date.now()),
    isOutgoing,
    isVideoCall: log.isVideoCall,
    me,
    remoteUser,

    endResult: log.endResult,
    duration,
    startedAt: log.startedAt,
  };
};

class CallHistoryManager {
  private _emitter: JSEventEmitterType = new JSEventEmitter();

  private _storage: SimpleStorage<{ [userId: string]: CallHistory[] }> = createStorage('calls@historyManager');
  private _historyAll: { [userId: string]: CallHistory[] } = {};
  private _userId: string | null = null;

  public async init(userId: string) {
    this._userId = userId;

    const data = await this._storage.get();
    if (data) this._historyAll = data;
    if (!this._historyAll[this._userId]) this._historyAll[this._userId] = [];
  }

  public async get() {
    const data = this._historyAll[this._userId ?? ''];
    return [...data];
  }

  public add(callId: string, log: DirectCallLog) {
    if (!this._userId) return;
    const history = asHistory(log);
    const histories = this._historyAll[this._userId];
    if (histories?.some((x) => x.callId === callId)) {
      return;
    }

    this._historyAll[this._userId].unshift(history);
    this._storage.update(this._historyAll);
    this._emitter.emit('update', history);
  }

  public subscribeUpdate = (callback: (log: CallHistory) => void) => {
    return this._emitter.addListener('update', callback as (...args: unknown[]) => void);
  };
}

export default new CallHistoryManager();
