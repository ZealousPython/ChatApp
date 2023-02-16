/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from 'axios';
import React from 'react';
//import type {} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Dimensions,
} from 'react-native';

import Chat from './chat';
import Session from './sessions';
import settings from '../settings.json';
let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

export default class MainWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      account: props.account,
      hasActiveSession: false,
      activeSessionID: -1,
      sessionData: [],
      foundUserSessions: false,
    };
  }
  componentDidMount(): void {
    this.getUserSessions();
  }
  getUserSessions() {
    let data = {
      requestType: 'GetSessions',
      account: this.state.account,
    };
    const config = {
      method: 'post',
      data: data,
      url: 'http://' + settings.serverAddress + '/ChatApp/sessions.php',
    };
    axios(config)
      .then(res => {
        if (res.data.success) {
          this.setState({
            account: res.data.account,
            sessionData: res.data.sessions,
            foundUserSessions: true,
          });
        } else {
          console.log(res.data.err, 'error');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  backPressed() {
    if (this.state.hasActiveSession) {
      this.exitChat();
    }
  }
  enterChat(session: any) {
    this.setState({
      hasActiveSession: true,
      activeSessionID: session.session_id,
    });
    this.props.chatEntered(session.session_name);
  }

  exitChat() {
    this.setState({
      hasActiveSession: false,
      activeSessionID: -1,
    });
    this.props.chatExited();
  }
  addSession() {}
  renderChats() {
    if (this.state.foundUserSessions) {
      return (
        <ScrollView>
          {this.state.sessionData.map((session: any, index: number) => (
            <Session
              sessionInfo={session}
              enterChat={() => this.enterChat(session)}
              key={index}
            />
          ))}
          <Pressable onPress={() => this.addSession()}></Pressable>
        </ScrollView>
      );
    }
  }
  renderChat() {
    return (
      <Chat
        sessionID={this.state.activeSessionID}
        userID={this.state.account.account_id}></Chat>
    );
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        {!this.state.hasActiveSession ? this.renderChats() : this.renderChat()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: (screenHeight / 10) * 8.5,
    width: screenWidth,
    alignItems: 'center',
  },
  tabText: {
    flex: 1,
    textAlign: 'center',
    color: '#AAAFBB',
    fontSize: 24,
    fontFamily: 'Roboto',
  },
  errorText: {
    fontSize: 14,
    color: '#AA3333',
    textAlign: 'center',
  },
  submitText: {
    color: '#AAAFBB',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    padding: 10,
    alignItems: 'center',
  },
});
