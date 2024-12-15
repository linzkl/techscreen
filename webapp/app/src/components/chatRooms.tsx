"use client";
import { useEffect, useState } from "react";

import { Alert, Card, Container, IconButton, Input } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";

import { ALPHA_NUMERIC_DASH_REGEX } from "@/constants";
import { createRoom, getRooms } from "@/services/helper";

import RoomCard from "./roomCard";

const ChatRooms = () => {
  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRooms()
      .then((res) => res.json())
      .then((res) => {
        setRooms(res["rooms"]);
      })
      .catch(() => {
        setMessage("");
        setError("Error fetching rooms.");
      });
  });

  return (
    <Container>
      <Grid size={12}>
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
      </Grid>
      <Grid size={12} columns={5} marginTop={5}>
        <div
          style={{
            display: "grid",
            gridGap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, auto))",
            justifyContent: "space-evenly",
          }}
        >
          {rooms.map((room) => (
            <RoomCard key={room} roomId={room}></RoomCard>
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
                      setError(output["message"]);
                      setMessage("");
                    } else {
                      setError("");
                      setMessage("Room created!");
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
