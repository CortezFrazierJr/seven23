import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import DeviceSettingsDaydream from 'material-ui/svg-icons/device/settings-system-daydream';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';
import AccountBox from 'material-ui/svg-icons/action/account-box';
import LiveHelp from 'material-ui/svg-icons/communication/live-help';

import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

const styles = {
  h1: {
    padding: '30px 10px 0px 0px',
    margin: '0',
    textAlign: 'center',
  },
  card: {
    margin: '0 20px',
    padding: '0 10px',
  },
  connect: {
    margin: '20px 0px 0px 150px',
  },
  actionsLeft: {
    position: 'fixed',
    bottom: '20px',
    left: '50px',
  },
  actionsRight: {
    position: 'fixed',
    bottom: '20px',
    right: '50px',
  },
};

class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.context = context;
    this.state = {
      open: false,
      loading: false,
      error: {},
      username: '',
      password: '',
      nextPathname: props.location.state ? props.location.state.nextPathname : '/',
    };
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // Start animation during login process
    this.setState({
      loading: true,
    });

    let self = this;

    // Wait for login return event
    UserStore.onceChangeListener((args) => {
      if (args) {
        self.setState({
          loading: false,
          error: {
            username: args.username || args.non_field_errors,
            password: args.password || args.non_field_errors,
          }
        });
      } else {
        self.context.router.replace(self.state.nextPathname);
      }
    });

     // Send login action
    UserActions.login(this.state.username, this.state.password);
  }

  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  }

  handleChangeUsername = (event) => {
    this.setState({username: event.target.value});
  }

  handleChangePassword = (event) => {
    this.setState({password: event.target.value});
  }

  render() {
    const standardActions = (
      <FlatButton
      label="Ok"
      primary={true}
      onTouchTap={this.handleRequestClose}
      />
      );

    return (
      <div>
        { this.state.loading
          ?
          <div className="flexboxContainer">
            <div className="flexbox">
              <CircularProgress size={80} />
            </div>
          </div>
          :
          <div className="flexboxContainer">
            <div className="flexbox">
              <Card style={styles.card}>
                <CardText expandable={false}>
                  <form onSubmit={e => this.handleSubmit(e)} >
                    <TextField
                      hintText="username"
                      floatingLabelText="Username"
                      value={this.state.username}
                      errorText={this.state.error.username}
                      onChange={this.handleChangeUsername}
                    /><br />
                    <TextField
                      hintText="Password Field"
                      floatingLabelText="Password"
                      type="password"
                      value={this.state.password}
                      errorText={this.state.error.password}
                      onChange={this.handleChangePassword}
                    /><br/>
                    <RaisedButton
                      label="Connect"
                      type="submit"
                      primary={true}
                      style={styles.connect} />
                  </form>
                </CardText>
              </Card>
              <div style={styles.actionsLeft}>
                <FlatButton
                label="Create Account"
                primary={true}
                onTouchTap={this.handleTouchTap}
                icon={<AccountBox/>}/>
                <FlatButton
                label="Forgotten Password"
                onTouchTap={this.handleTouchTap}
                icon={<LiveHelp/>} />
              </div>
              <div style={styles.actionsRight}>
                <FlatButton
                label="Server"
                primary={true}
                onTouchTap={this.handleTouchTap}
                icon={<DeviceSettingsDaydream/>}/>
                <FlatButton
                label="About"
                primary={true}
                onTouchTap={this.handleTouchTap}
                icon={<InfoOutline/>}/>
              </div>
            </div>

            <Dialog
            open={this.state.open}
            title="Super Secret Password"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
            >
            1-2-3-4-5
            </Dialog>
          </div>
        }
      </div>
    );
  }
}

// Inject router in context
Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Login;
