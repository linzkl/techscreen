"use client";
import { Button, Container } from "@mui/material";

import { selectRoom } from "@/lib/features/metaSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const ChatDialog = () => {
  const room = useAppSelector((state) => state.metadata.selectedRoom);
  const dispatch = useAppDispatch();
  return (
    <Container>
      <Button variant="contained" onClick={() => dispatch(selectRoom(""))}>
        LEAVE
      </Button>
      <div>room: {room} chat here</div>
    </Container>
  );
};

export default ChatDialog;
