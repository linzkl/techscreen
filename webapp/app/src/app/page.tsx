"use client";

import dynamic from "next/dynamic";
import { Dialog } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ChatRooms from "@/components/chatRooms";
import ConnectUser from "@/components/connectUser";
import ChatDialog from "@/components/chatDialog";
import { useAppSelector } from "@/lib/hooks";

const ChatHeader = dynamic(() => import("@/components/chatHeader"), {
  ssr: false,
});
export default function Home() {
  const metadata = useAppSelector((state) => state.metadata);
  const { connectedUser, selectedRoom } = metadata;

  return (
    <Grid container size={12}>
      <Grid container size={12} justifyContent={"center"}>
        <ChatHeader></ChatHeader>
      </Grid>
      <Grid container size={12} marginTop={5}>
        {connectedUser && selectedRoom ? (
          <ChatDialog></ChatDialog>
        ) : (
          <ChatRooms></ChatRooms>
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
