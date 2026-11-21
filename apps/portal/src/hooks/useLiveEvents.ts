import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { connectLiveEvents, type LiveEvent } from '@/lib/sse';
import { keys } from './queries';

/** Nombre d'événements conservés pour le fil d'activité en direct. */
const BUFFER = 30;

export interface LiveEntry extends LiveEvent {
  /** Identifiant local, croissant : sert de clé d'animation. */
  seq: number;
}

export interface LiveState {
  connected: boolean;
  lastEvent: LiveEvent | null;
  /** Derniers événements reçus, du plus récent au plus ancien. */
  events: LiveEntry[];
  /** Événements arrivés depuis la dernière ouverture du fil d'activité. */
  unread: number;
  markRead: () => void;
}

export const LiveContext = createContext<LiveState>({ connected: false, lastEvent: null, events: [], unread: 0, markRead: () => undefined });

/**
 * Ouvre le flux SSE de l'API et invalide les données concernées à chaque événement :
 * les étapes d'un workflow s'allument en direct sans rechargement. Les événements sont
 * aussi conservés (30 derniers) pour le fil d’activité.
 */
export function useLiveEventsConnection(enabled: boolean): LiveState {
  const client = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<LiveEntry[]>([]);
  const [unread, setUnread] = useState(0);
  const pending = useRef(new Set<string>());
  const timer = useRef<number | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    const flush = () => {
      timer.current = null;
      for (const key of pending.current) void client.invalidateQueries({ queryKey: JSON.parse(key) as unknown[] });
      pending.current.clear();
    };
    const schedule = (queryKey: readonly unknown[]) => {
      pending.current.add(JSON.stringify(queryKey));
      timer.current ??= window.setTimeout(flush, 250);
    };

    void connectLiveEvents({
      signal: controller.signal,
      onStatus: setConnected,
      onEvent: (event) => {
        seq.current += 1;
        const entry: LiveEntry = { ...event, seq: seq.current };
        setEvents((previous) => [entry, ...previous].slice(0, BUFFER));
        setUnread((count) => Math.min(count + 1, 99));
        const { runId, employeeId } = event.data as { runId?: string; employeeId?: string };
        if (runId) schedule(keys.run(runId));
        if (employeeId) schedule(keys.employee(employeeId));
        schedule(['runs']);
        schedule(keys.dashboard);
        if (event.type === 'employee.updated') schedule(['employees']);
      },
    });
    return () => {
      controller.abort();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [client, enabled]);

  const markRead = useCallback(() => setUnread(0), []);

  return { connected, lastEvent: events[0] ?? null, events, unread, markRead };
}

export const useLive = () => useContext(LiveContext);
