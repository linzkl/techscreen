"use client";

import {
  Alert,
  Button,
  Card,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import Grid from "@mui/material/Grid2";
import ChatHeader from "@/components/chatHeader";
import { createRoom, getRooms } from "@/services/helper";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { ALPHA_NUMERIC_DASH_REGEX } from "@/constants";
import RoomCard from "@/components/roomCard";

export default function Home() {
  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

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
    <Grid container size={12}>
      <Grid container size={12} justifyContent={"center"}>
        <ChatHeader></ChatHeader>
      </Grid>
      <Grid size={12}>
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
      </Grid>
      <Grid container size={12} marginTop={5}>
        <Grid size={2} display={"flex"} justifyContent={"center"}>
          <Typography color="primary">Rooms:</Typography>
        </Grid>
        <Grid size={10} columns={5}>
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
              // <div
              //   style={{
              //     position: "relative",
              //     width: "100%",
              //     display: "flex",
              //     flexDirection: "row",
              //     justifyContent: "center",
              //     alignItems: "center",
              //     textAlign: "center",
              //   }}
              //   key={room}
              // >
              //   <HomeIcon color="primary"></HomeIcon>
              //   <Button>{room}</Button>
              // </div>
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
        <Grid size={12}></Grid>
      </Grid>
    </Grid>
  );
}
