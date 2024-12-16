"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";

import { ALPHA_NUMERIC_DASH_REGEX } from "@/constants";
import { updateUser } from "@/lib/features/metaSlice";
import { useAppDispatch } from "@/lib/hooks";

const ConnectUser = (params: { open: boolean }) => {
  const [user, setUser] = useState("");
  const dispatch = useAppDispatch();

  const handleConnect = () => {
    dispatch(updateUser(user));
  };

  return (
    <Dialog
      open={params.open}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px",
      }}
      PaperProps={{
        component: "form",
        onSubmit: handleConnect,
      }}
    >
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
        <Button variant="contained" onClick={handleConnect}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectUser;
