"use client";

import { selectRoom } from "@/lib/features/metaSlice";
import { useAppDispatch } from "@/lib/hooks";
import { removeRoom } from "@/services/helper";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";

const RoomCard = (params: { roomId: string }) => {
  const [error, setError] = useState<string | null>(null);
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
              setError(out.message);
            } else {
              setError("");
            }
          }}
        >
          Remove
        </Button>
      </CardActions>
      {error && <Alert severity="error">{error}</Alert>}
    </Card>
  );
};

export default RoomCard;
