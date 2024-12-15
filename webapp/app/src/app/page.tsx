"use client";

import dynamic from "next/dynamic";
import { Alert, Dialog } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ChatRooms from "@/components/chatRooms";
import ConnectUser from "@/components/connectUser";
import ChatDialog from "@/components/chatDialog";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { getRooms } from "@/services/helper";
import { selectRoom } from "@/lib/features/metaSlice";

const ChatHeader = dynamic(() => import("@/components/chatHeader"), {
  ssr: false,
});

export default function Home() {
  const metadata = useAppSelector((state) => state.metadata);
  const { connectedUser, selectedRoom } = metadata;
  const [rooms, setRooms] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    getRooms()
      .then((res) => res.json())
      .then((res) => {
        setRooms(res["rooms"]);
        if (res["rooms"].length === 0) {
          dispatch(selectRoom(""));
        }
      })
      .catch(() => {
        setMessage("");
        setError("Error fetching rooms.");
      });
  }, [error, message]);

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
        {connectedUser && rooms.includes(selectedRoom) ? (
          <ChatDialog></ChatDialog>
        ) : (
          <ChatRooms
            rooms={rooms}
            setError={setError}
            setMessage={setMessage}
          ></ChatRooms>
        )}
      </Grid>
      <Dialog
        open={!Boolean(connectedUser)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ConnectUser />
      </Dialog>
    </Grid>
  );
}
