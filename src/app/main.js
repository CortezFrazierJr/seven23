/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Router, Route, Redirect, Switch } from "react-router-dom";
import { HookedBrowserRouter } from "./router";
import moment from "moment";

import axios from "axios";
import encryption from "./encryption";

import { MuiThemeProvider } from "@material-ui/core/styles"; // v1.x
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import SyncButton from "./components/accounts/SyncButton";
import AccountSelector from "./components/accounts/AccountSelector";
import CurrencySelector from "./components/currency/CurrencySelector";
import UserButton from "./components/settings/UserButton";
import SnackbarsManager from "./components/snackbars/SnackbarsManager";

// Component for router
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Analytics from "./components/Analytics";
import Changes from "./components/Changes";
import Categories from "./components/Categories";
import Settings from "./components/Settings";
import Logout from "./components/Logout";
import NewAccounts from "./components/NewAccounts";

import AppActions from "./actions/AppActions";
import ServerActions from "./actions/ServerActions";

import { useTheme } from "./theme";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

import "./main.scss";

export const Main = () => {
  const dispatch = useDispatch();
  const lastSync = useSelector(state => state.server.last_sync);
  const lastSeen = useSelector(state => state.app.last_seen);
  const path = useSelector(state => state.app.url);

  useEffect(() => {
    if (path != "/logout" && path != "/resetpassword") {
      history.push(path);
    }
    const removeListener = history.listen(location => {
      dispatch(AppActions.navigate(location.pathname));
    });

    // Init axios
    axios.defaults.timeout = 15000;
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error && error.response && error.response.status === 503) {
          dispatch(ServerActions.maintenance());
        } else {
          dispatch(ServerActions.error(error.response));
        }
        return Promise.reject(error);
      }
    );

    // Connect with workbow to display snackbar when update is available.
    if (process.env.NODE_ENV != "development" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(registration => {
            registration.onupdatefound = event => {
              dispatch(
                AppActions.snackbar(
                  "🔥 An update has just been installed and is now available on your device.",
                  "Restart to update",
                  () => {
                    window.location.reload();
                  }
                )
              );
            };
          })
          .catch(registrationError => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }

    return () => {
      removeListener();
    };
  }, []);

  // Manage visibility event
  useEffect(() => {
    // Using Page visibility API
    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange() {
      if (!document[hidden]) {
        const minutes = moment().diff(moment(lastSync), "minutes");
        if (lastSync && minutes >= 60) {
          dispatch(ServerActions.sync());
        }
        const minutes_last_seen = moment().diff(moment(lastSeen), "minutes");
        if (minutes_last_seen > 60 * 10) {
          dispatch(AppActions.snackbar("Welcome back 👋"));
        }
        dispatch(AppActions.lastSeen());
      }
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
    handleVisibilityChange();

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, [lastSync]);

  // Update encryption cipher
  const cipher = useSelector(state => (state.user ? state.user.cipher : ""));
  useEffect(() => {
    if (cipher) {
      encryption.key(cipher);
    }
  }, [cipher]);

  // Update server url
  const url = useSelector(state => (state.server ? state.server.url : ""));
  axios.defaults.baseURL = url;

  useEffect(() => {
    axios.defaults.baseURL = url;
  }, [url]);

  // manage Theme
  const theme = useTheme();
  const isConnecting = useSelector(state => state.state.isConnecting);
  const isSyncing = useSelector(
    state => state.state.isSyncing || state.state.isLoading
  );
  const isLogged = useSelector(state =>
    state.server ? state.server.isLogged : false
  );

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const nbAccount = useSelector(
    state => state.accounts.remote.length + state.accounts.local.length
  );
  const account = useSelector(state => state.account);

  return (
    <HookedBrowserRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div id="appContainer">
            <div id="iPadBorder"></div>
            <div
              id="container"
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
              }}
            >
              {nbAccount >= 1 ? (
                <aside className="navigation">
                  <Route component={Navigation} />
                </aside>
              ) : (
                ""
              )}
              <div id="content">
                <div id="toolbar" className="hideMobile">
                  <div className="left"></div>
                  <div className="right">
                    {account && !account.isLocal ? (
                      <SyncButton className="showDesktop" />
                    ) : (
                      ""
                    )}

                    {nbAccount >= 1 && !account.isLocal ? (
                      <hr className="showDesktop" />
                    ) : (
                      ""
                    )}
                    {nbAccount > 1 ? (
                      <AccountSelector
                        disabled={isSyncing}
                        className="showDesktop"
                      />
                    ) : (
                      ""
                    )}
                    {nbAccount >= 1 ? (
                      <CurrencySelector
                        disabled={isSyncing}
                        display="code"
                        className="showDesktop"
                      />
                    ) : (
                      ""
                    )}
                    <hr className="showDesktop" />
                    <UserButton history={history} />
                  </div>
                </div>
                <main style={{ position: "relative", flexGrow: 1 }}>
                  {nbAccount >= 1 ? (
                    <Switch>
                      <Redirect exact from="/" to="/dashboard" />
                      <Redirect exact from="/login" to="/dashboard" />
                      <Redirect exact from="/resetpassword" to="/dashboard" />
                      <Route exact path="/dashboard" component={Dashboard} />
                      <Route exact path="/analytics" component={Analytics} />
                      <Redirect
                        exact
                        from="/transactions"
                        to={`/transactions/${year}/${month}`}
                      />
                      <Route
                        path="/transactions/:year/:month"
                        component={Transactions}
                      />
                      <Route exact path="/categories" component={Categories} />
                      <Route path="/categories/:id" component={Categories} />
                      <Route exact path="/changes" component={Changes} />
                      <Route path="/changes/:id" component={Changes} />
                      <Route path="/settings" component={Settings} />
                      <Route path="/logout" component={Logout} />
                    </Switch>
                  ) : (
                    <Switch>
                      <Route path="/logout" component={Logout} />
                      <Route component={NewAccounts} />
                    </Switch>
                  )}
                  <SnackbarsManager />
                </main>
              </div>
            </div>
          </div>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </HookedBrowserRouter>
  );
};
