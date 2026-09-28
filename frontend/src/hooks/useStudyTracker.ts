import { useEffect, useRef } from 'react';
import { analyticsAPI } from '../api/analytics';

interface StudyTrackerOptions {
  topicId: number | null | undefined;
  activityType?: string;
  heartbeatIntervalMs?: number;
}

export function useStudyTracker({
  topicId,
  activityType = 'reading',
  heartbeatIntervalMs = 30000,
}: StudyTrackerOptions) {
  const accumulatedSecondsRef = useRef<number>(0);
  const activeTopicIdRef = useRef<number | null | undefined>(topicId);
  const activityTypeRef = useRef<string>(activityType);

  activeTopicIdRef.current = topicId;
  activityTypeRef.current = activityType;

  useEffect(() => {
    if (!topicId) return;

    // Track active seconds
    const timer = setInterval(() => {
      accumulatedSecondsRef.current += 1;
    }, 1000);

    // Heartbeat sender
    const heartbeatTimer = setInterval(() => {
      if (activeTopicIdRef.current && accumulatedSecondsRef.current >= 5) {
        const duration = accumulatedSecondsRef.current;
        accumulatedSecondsRef.current = 0;
        analyticsAPI.postHeartbeat({
          topic_id: activeTopicIdRef.current,
          duration_seconds: duration,
          activity_type: activityTypeRef.current,
        }).catch((err) => {
          console.warn('Study session heartbeat failed:', err);
        });
      }
    }, heartbeatIntervalMs);

    return () => {
      clearInterval(timer);
      clearInterval(heartbeatTimer);

      // Flush remaining time on unmount / change if >= 5 seconds
      if (activeTopicIdRef.current && accumulatedSecondsRef.current >= 5) {
        const duration = accumulatedSecondsRef.current;
        accumulatedSecondsRef.current = 0;
        analyticsAPI.postHeartbeat({
          topic_id: activeTopicIdRef.current,
          duration_seconds: duration,
          activity_type: activityTypeRef.current,
        }).catch(() => {});
      }
    };
  }, [topicId, heartbeatIntervalMs]);
}

export default useStudyTracker;
