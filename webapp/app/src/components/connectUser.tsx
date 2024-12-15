"use client";

import { useState } from "react";
import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";

import { ALPHA_NUMERIC_DASH_REGEX } from "@/constants";
import { updateUser } from "@/lib/features/metaSlice";
import { useAppDispatch } from "@/lib/hooks";

const ConnectUser = () => {
  const [user, setUser] = useState("");
  const dispatch = useAppDispatch();

  return (
    <Container style={{ margin: "20px" }}>
      <DialogTitle>Enter a username to connect</DialogTitle>
      <DialogContent>
        <Input
          fullWidth
          color="primary"
          placeholder="username for connect, alphanumeric"
          onChange={(e) => setUser(e.target.value.toLowerCase())}
          onKeyDown={(event) => {
            if (!ALPHA_NUMERIC_DASH_REGEX.test(event.key)) {
              event.preventDefault();
            }
          }}
          inputProps={{
            maxLength: 15,
          }}
          style={{ marginRight: "10px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => dispatch(updateUser(user))}>
          Connect
        </Button>
      </DialogActions>
    </Container>
  );
};

export default ConnectUser;
