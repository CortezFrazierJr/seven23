import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";

import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Divider from "@mui/material/Divider";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExitToApp from "@mui/icons-material/ExitToApp";
import DeleteForever from "@mui/icons-material/DeleteForever";
import BugReportIcon from "@mui/icons-material/BugReport";

import UserActions from "../../actions/UserActions";
import AppActions from "../../actions/AppActions";

export default function AppSettings() {
  const dispatch = useDispatch();

  return (
    <div
      className="layout_content wrapperMobile"
      subheader={
        <ListSubheader disableSticky={true}>Authentication</ListSubheader>
      }
    >
      <List>
        <ListItem>
          <ListItemText
            primary="Build date"
            secondary={
              process.env.BUILD_DATE
                ? moment(process.env.BUILD_DATE).toString()
                : "NC"
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Commit number"
            secondary={process.env.GIT_COMMIT ? JSON.stringify(`${process.env.GIT_COMMIT}`) : "NC"}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => window.method.does.not.exist()}>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText
            primary="Generate fake exception"
            secondary="Useful to test error handling and reporting"
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => AppActions.reload()}>
          <ListItemIcon>
            <RefreshIcon />
          </ListItemIcon>
          <ListItemText
            primary="Force reload"
            secondary="Reload current page"
          />
        </ListItem>
        <ListItem button onClick={() => dispatch(UserActions.logout(true))}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Force logout"
            secondary="Will ignore sync status"
          />
        </ListItem>
        <ListItem button onClick={() => dispatch(AppActions.reset())}>
          <ListItemIcon>
            <DeleteForever />
          </ListItemIcon>
          <ListItemText
            primary="Reset the app"
            secondary="Full reset of the app on your device"
          />
        </ListItem>
      </List>
    </div>
  );
}