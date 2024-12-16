import { DOMAIN_URL, ROOM_ACTION_URL } from "../constants";

export const getRooms = async () => {
  return invokeRoomAction("GET", null);
};

export const createRoom = async (roomId: string) => {
  return invokeRoomAction(
    "POST",
    JSON.stringify({
      room_id: roomId,
    })
  );
};

export const removeRoom = async (roomId: string) => {
  return invokeRoomAction(
    "DELETE",
    JSON.stringify({
      room_id: roomId,
    })
  );
};

const invokeRoomAction = async (action: string, body: string | null) => {
  const request = {
    method: action,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };
  try {
    return await fetch(ROOM_ACTION_URL, request);
  } catch (e) {
    console.error(`Backend error: ${e}`)
    return new Response(
      JSON.stringify({ message: "Backend connection issue." }),
      { status: 500 }
    );
  }
};

export const connect = (roomId: string, username: string) => {
  return new WebSocket(`ws://${DOMAIN_URL}/ws/${roomId}/${username}`);
};

export const sendMessage = (ws: WebSocket, message: string) => {
  ws.send(message);
};

export const disconnect = (ws: WebSocket) => {
  if (ws != null && ws.readyState == WebSocket.OPEN) {
    ws.close();
  }
};
