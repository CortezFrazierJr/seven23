/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";

import UserActions from "../../../actions/UserActions";

export default function UserNameForm({ onSubmit, onClose }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState(
    useSelector(state => state.user.profile.username)
  );
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const save = e => {
    if (e) {
      e.preventDefault();
    }

    setError({});
    setLoading(true);

    dispatch(UserActions.update({ username }))
      .then(() => {
        onSubmit();
        setLoading(false);
      })
      .catch(error => {
        if (error && error["username"]) {
          setError(error);
          setLoading(false);
        }
      });
  };

  return (
    <form onSubmit={save} className="content">
      <header>
        <h2 style={{ color: "white" }}>Username</h2>
      </header>
      {loading ? <LinearProgress mode="indeterminate" /> : ""}
      <div className="form">
        <TextField
          label="Username"
          onChange={event => setUsername(event.target.value)}
          disabled={loading}
          defaultValue={username}
          error={Boolean(error.username)}
          helperText={error.username}
          fullWidth
          margin="normal"
          variant="standard"
        />
      </div>
      <footer>
        <Button color='inherit' onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginLeft: "8px" }}
        >
          Submit
        </Button>
      </footer>
    </form>
  );
}