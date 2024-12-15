"use client";

import { WEBSOCKET_URL } from "@/constants";
import { selectRoom } from "@/lib/features/metaSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removeRoom } from "@/services/helper";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const RoomCard = (params: {
  roomId: string;
  setError: (error: string) => void;
  setMessage: (message: string) => void;
  setSocket: (ws: WebSocket) => void;
}) => {
  const user = useAppSelector((state) => state.metadata.connectedUser);
  const dispatch = useAppDispatch();

  return (
    <Card sx={{ width: 200 }}>
      <CardMedia sx={{ height: 180 }} image="/cgate.jpg" title="Cgate" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {params.roomId}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            dispatch(selectRoom(params.roomId));
            const ws = new WebSocket(
              `${WEBSOCKET_URL}${params.roomId}/${user}`
            );
            params.setSocket(ws)
          }}
        >
          Enter
        </Button>
        <Button
          size="small"
          onClick={async () => {
            const res = await removeRoom(params.roomId);
            if (res.status !== 204) {
              const out = await res.json();
              params.setError(out.message);
              params.setMessage("");
            } else {
              params.setError("");
              params.setMessage(`Room ${params.roomId} removed!`);
            }
          }}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoomCard;
