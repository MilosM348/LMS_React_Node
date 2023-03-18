import React, { useState, useEffect } from "react";
import {
  Paper,
  Container,
  TextField,
  Button,
  Grid,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NotificationManager } from "react-notifications";

import Nav from "../../layout/nav_company";
import { useSetting } from "../../../provider/setting";
import { useAsync } from "../../../service/utils";
import { changePassword } from "../../../api/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  title: {
    fontSize: "18px",
    paddingBottom: 30,
  },
  button: {
    textTransform: "none",
    fontSize: 15,
  },
  refresh: {
    float: "right",
    marginRight: 30,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const ChangePassword = () => {
  const { data, status, error, run } = useAsync({
    status: "idle",
  });
  const classes = useStyles();
  const [setting] = useSetting();
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false)

  const validate = () => {
    let res = true;
    if (newPassword === "")
      res = false;
    else if (password === "")
      res = false;
    if (!res)
      NotificationManager.warning('Please input requried fields.', "Warning", 3000);
    return res;
  };
  const handleChange = () => {
    if (!validate())
      return;
    run(changePassword({
      _id: setting?.auth?._id,
      password: password,
      newPassword: newPassword,
    }));
    setPending(true)
  };

  useEffect(() => {
    if (status === "resolved") {
      NotificationManager.success("Password is updated successfully!", "Success", 3000);
      setPassword("")
      setNewPassword("")
      setPending(false)
    } else if (status === "rejected") {
      console.log(error);
      NotificationManager.error(error?.message, "Error", 3000);
      setPending(false)
    }
  }, [status]);
  return (
    <>
      <Nav />
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="lg">
        <h2 style={{ textAlign: "center", padding: 50 }}>Password Change</h2>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Paper style={{ width: 400, padding: 20, margin: 20 }}>
            <TextField
              margin="dense"
              id="password"
              label="Password"
              inputProps={{
                min: 0,
                style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 },
              }}
              type="password"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: 20 }}
            />
            <TextField
              margin="dense"
              id="newPassword"
              label="New Password"
              inputProps={{
                min: 0,
                style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 },
              }}
              type="password"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginTop: 20 }}
            />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ paddingTop: 20 }}
            >
              <Button
                className={classes.button}
                variant="outlined"
                onClick={handleChange}
              >
                Change
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </>
  );
};

export default ChangePassword;
