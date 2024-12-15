"use client";
import { useState } from "react";

import { Card, Container, IconButton, Input } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";

import { ALPHA_NUMERIC_DASH_REGEX } from "@/constants";
import { createRoom } from "@/services/helper";

import RoomCard from "./roomCard";

const ChatRooms = (params: {
  rooms: string[];
  setError: (error: string) => void;
  setMessage: (message: string) => void;
  setSocket: (ws: WebSocket) => void;
}) => {
  const [newRoomName, setNewRoomName] = useState("");

  return (
    <Container>
      <Grid size={12} columns={5} marginTop={5}>
        <div
          style={{
            display: "grid",
            gridGap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, auto))",
            justifyContent: "space-evenly",
          }}
        >
          {params.rooms.map((room) => (
            <RoomCard
              key={room}
              roomId={room}
              setError={params.setError}
              setMessage={params.setMessage}
              setSocket={params.setSocket}
            ></RoomCard>
          ))}
          <Card
            sx={{ width: 200, height: 180 }}
            style={{
              position: "relative",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Input
              color="primary"
              placeholder="New room name:"
              onChange={(e) => setNewRoomName(e.target.value.toLowerCase())}
              onKeyDown={(event) => {
                if (!ALPHA_NUMERIC_DASH_REGEX.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            {newRoomName && (
              <IconButton
                onClick={async () => {
                  if (newRoomName.length > 0) {
                    const res = await createRoom(newRoomName);
                    const output = await res.json();
                    if (res.status != 201) {
                      params.setError(output["message"]);
                      params.setMessage("");
                    } else {
                      params.setError("");
                      params.setMessage("Room created!");
                    }
                  }
                }}
              >
                <AddIcon color="primary" fontSize="large"></AddIcon>
              </IconButton>
            )}
          </Card>
        </div>
      </Grid>
    </Container>
  );
};

export default ChatRooms;
