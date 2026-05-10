"use client";

import Pusher, { type Channel } from "pusher-js";

let singleton: Pusher | null = null;

function getPusherConfig() {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    return null;
  }

  return { key, cluster };
}

export function getPusherClient(): Pusher | null {
  if (singleton) {
    return singleton;
  }

  const config = getPusherConfig();
  if (!config) {
    return null;
  }

  singleton = new Pusher(config.key, {
    cluster: config.cluster,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],
  });

  return singleton;
}

export function subscribeChannel(channelName: string): Channel | null {
  const client = getPusherClient();
  if (!client) {
    return null;
  }

  return client.subscribe(channelName);
}

export function unsubscribeChannel(channelName: string) {
  const client = getPusherClient();
  if (!client) {
    return;
  }

  client.unsubscribe(channelName);
}
