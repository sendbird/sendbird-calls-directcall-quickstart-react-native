import { useRef, useState } from 'react';

import { DirectCallEndResult, DirectCallLogListQuery, SendbirdCalls } from '@sendbird/calls-react-native';

import CallHistoryManager, { CallHistory, asHistory } from '../libs/CallHistoryManager';
import { useEffectAsync } from './useEffectAsync';

export const useLocalHistory = () => {
  const [history, setHistory] = useState<CallHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffectAsync(async () => {
    setHistory(await CallHistoryManager.get());
    setLoading(false);

    return CallHistoryManager.subscribeUpdate((h) => {
      setHistory((prev) => [h, ...prev]);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await CallHistoryManager.get();
    setHistory(data);
    setRefreshing(false);
  };

  return { history, loading, refreshing, onRefresh };
};

export const useRemoteHistory = () => {
  const [history, setHistory] = useState<CallHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const query = useRef<DirectCallLogListQuery>();

  useEffectAsync(async () => {
    await initQuery();

    const unsubscribes = [
      CallHistoryManager.subscribeUpdate((history) => setHistory((prev) => [history, ...prev])),
      () => query.current?.release(),
    ];
    return () => unsubscribes.forEach((fn) => fn());
  }, []);

  const initQuery = async () => {
    query.current?.release();
    query.current = await SendbirdCalls.createDirectCallLogListQuery({
      // myRole: 'ALL',
      endResults: [
        DirectCallEndResult.COMPLETED,
        DirectCallEndResult.CANCELED,
        DirectCallEndResult.DECLINED,
        DirectCallEndResult.DIAL_FAILED,
        DirectCallEndResult.ACCEPT_FAILED,
      ],
      limit: 20,
    });
    setHistory((await query.current.next()).map(asHistory));
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initQuery();
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (query.current?.hasNext) {
      const value = await query.current.next();
      setHistory((prev) => prev.concat(...value.map(asHistory)));
    }
  };

  return { history, loading, refreshing, onRefresh, onEndReached };
};
