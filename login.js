import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';

class App extends React.Component {
	constructor(props) {
		super(props);

		// open corresponds to whether the Dialog (telling you to login using your @d211.org email) is shown or not
		this.state = {open: false};

		this.onSignIn = this.onSignIn.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	// Called when a user signs in. Gets user's data from the googleUser object and sends it to the server.
	onSignIn(googleUser) {
		let profile = googleUser.getBasicProfile();
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.open("POST", "http://battleforcharity.com/create-user", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
			name: profile.getName(),
			email: profile.getEmail(),
			profile_id: profile.getId(),
			hd: googleUser.getHostedDomain()
		}));

		let self = this
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {

				// If the server says the login failed (the user tried logging in w/o their school email), the Dialog is shown.
				if (xhr.status == 403) {
					self.setState({open: true});
				}
				else {

					// If the login is successful, the server stores login data to a session.
					// Consequently, a new request to the server will return the user's main page.
					window.location.reload(true);
				}
			}
		}

		var auth2 = window.gapi.auth2.getAuthInstance();
		auth2.disconnect();
	}

	onFailedSignIn(args) {
		console.log("Google login failed.");
	}

	onClose() {
		this.setState({open: false});
	}

	render() {
		return (
			<div className="everything">
				<div className="loginTitle" style={{paddingTop: "30px"}}>Battle For Charity</div>
				<div className="description">Sign in to make your bracket</div>
				<div className="googleButton">
					<GoogleLogin classname="googleButton" clientId="360968735809-85smlnpttakq9ql1ij9mmijibc3q24dq.apps.googleusercontent.com" onSuccess={this.onSignIn} onFailure={this.onFailedSignIn} theme="dark"/>
				<Dialog
          open={this.state.open}
					onClose={this.onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Please sign in using your school email ending with "@students.d211.org" or "@d211.org"</DialogTitle>
				<DialogActions>
            <Button onClick={this.onClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));
