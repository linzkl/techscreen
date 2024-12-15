"use client";

import { useState } from "react";
import { Button, Container, Input, Typography } from "@mui/material";

import { ALPHA_NUMERIC_DASH_REGEX } from "@/constants";
import { updateUser } from "@/lib/features/metaSlice";
import { useAppDispatch } from "@/lib/hooks";

const ConnectUser = () => {
  const [user, setUser] = useState("");
  const dispatch = useAppDispatch();

  return (
    <Container style={{ margin: "20px" }}>
      <Typography variant="h6" noWrap>
        Enter a username to connect
      </Typography>
      <Input
        color="primary"
        placeholder="username for connect"
        onChange={(e) => setUser(e.target.value.toLowerCase())}
        onKeyDown={(event) => {
          if (!ALPHA_NUMERIC_DASH_REGEX.test(event.key)) {
            event.preventDefault();
          }
        }}
        style={{ marginRight: "10px" }}
      />
      <Button variant="contained" onClick={() => dispatch(updateUser(user))}>
        Connect
      </Button>
    </Container>
  );
};

export default ConnectUser;
