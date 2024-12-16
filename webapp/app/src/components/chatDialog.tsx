"use client";
import {
  Button,
  Dialog,
  IconButton,
  Input,
  SnackbarContent,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SendIcon from "@mui/icons-material/Send";

import { selectRoom } from "@/lib/features/metaSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";

const ChatDialog = (params: {
  socket: WebSocket | undefined;
  setError: (error: string) => void;
  setMessage: (message: string) => void;
}) => {
  const metadata = useAppSelector((state) => state.metadata);
  const { connectedUser, selectedRoom } = metadata;

  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.socket && params.socket.readyState === WebSocket.CONNECTING) {
      params.socket.onmessage = (event: MessageEvent<string>) => {
        setMessages((messages) => [...messages, event.data]);
      };
      params.socket.onclose = (event) => {
        params.setError("Error connecting: " + event.reason);
        dispatch(selectRoom(""));
      };
    }
    if (params.socket && params.socket.readyState === WebSocket.OPEN) {
      params.socket.onmessage = (event: MessageEvent<string>) => {
        setMessages((messages) => [...messages, event.data]);
      };
      params.socket.onclose = () => {
        params.setMessage(`Left room: ${selectedRoom}`);
      };
    }
  });

  const handleSendMessage = (event: React.FormEvent) => {
    if (
      newMessage &&
      params.socket &&
      params.socket.readyState === WebSocket.OPEN
    ) {
      params.socket.send(newMessage);
      setNewMessage("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
    event.preventDefault();
  };

  return (
    <Grid container size={12} justifyContent={"center"}>
      <Grid
        container
        size={12}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        position={"sticky"}
        height={"5vh"}
        top={0}
        marginBottom={"10px"}
      >
        <Button
          variant="contained"
          onClick={() => {
            dispatch(selectRoom(""));
            if (
              params.socket != null &&
              params.socket.readyState == WebSocket.OPEN
            ) {
              params.socket.close();
            }
          }}
        >
          LEAVE
        </Button>
        <Dialog
          open={!Boolean(connectedUser)}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></Dialog>
      </Grid>
      <Grid
        container
        size={10}
        spacing={1}
        columns={12}
        textAlign={"center"}
        height={"70vh"}
        overflow={"auto"}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          {messages.map((message, index) => (
            <SnackbarContent
              message={message}
              key={index}
              sx={
                message.startsWith(`${connectedUser}:`)
                  ? { justifyContent: "flex-end", backgroundColor: "green" }
                  : { justifyContent: "flex-start" }
              }
            />
          ))}
        </Stack>
      </Grid>
      <Grid
        size={12}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        position={"sticky"}
        height={"5vh"}
        bottom={0}
        margin={"10px"}
      >
        <form
          action=""
          onSubmit={handleSendMessage}
          style={{ display: "flex", width: "90%" }}
        >
          <Input
            fullWidth
            color="primary"
            placeholder="Send message:"
            onChange={(e) => setNewMessage(e.target.value)}
            inputRef={inputRef}
          />
          <IconButton onClick={handleSendMessage}>
            <SendIcon color="primary" fontSize="large"></SendIcon>
          </IconButton>
        </form>
      </Grid>
    </Grid>
  );
};

export default ChatDialog;
