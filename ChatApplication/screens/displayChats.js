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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Chat from './chat';
import Session from './sessions';
import settings from '../settings.json';
import {text} from '@fortawesome/fontawesome-svg-core';
let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;
const lightColor = '#333344';
const darkColor = '#222233';
const lighterColor = '#444455';
const textColor = '#AAAFBB';
export default class MainWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
      hasActiveSession: false,
      activeSessionID: -1,
      sessionData: [],
      foundUserSessions: false,
      popupOpen: false,
      addChatName: '',
      addChatUsername: '',
    };
    this.popupMenu = React.createRef();
  }
  componentDidMount() {
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
  createUserSession() {
    let data = {
      requestType: 'CreateSession',
      account: this.state.account,
      other_username: this.state.addChatUsername,
      session_name: this.state.addChatName,
    };
    const config = {
      method: 'post',
      data: data,
      url: 'http://' + settings.serverAddress + '/ChatApp/sessions.php',
    };
    axios(config)
      .then(res => {
        if (res.data.success) {
          this.getUserSessions();
          this.setState({popupOpen: false});
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
  enterChat(session) {
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
  addSession() {
    this.setState({popupOpen: true});
  }
  renderChats() {
    if (this.state.foundUserSessions) {
      return (
        <ScrollView>
          {this.state.sessionData.map((session, index) => (
            <Session
              sessionInfo={session}
              enterChat={() => this.enterChat(session)}
              key={index}
            />
          ))}
          <Pressable onPress={() => this.addSession()} style={styles.addChat}>
            <Text style={[styles.submitText, {textAlign: 'center'}]}>
              Add Chat
            </Text>
            <FontAwesomeIcon
              style={[
                styles.submitText,
                {
                  alignSelf: 'center',
                },
              ]}
              icon={faCirclePlus}
              color={textColor}
              size={screenHeight / 30}
            />
          </Pressable>
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
        <Menu opened={this.state.popupOpen} style={{width: screenWidth}}>
          <MenuTrigger></MenuTrigger>
          <MenuOptions
            style={{
              backgroundColor: lightColor,
              width: screenWidth,
            }}>
            <View style={styles.menuInput}>
              <Text style={styles.menuText}>Session Name:</Text>
              <TextInput
                value={this.state.addChatName}
                onChangeText={name => this.setState({addChatName: name})}
                style={styles.textInput}></TextInput>
              <Text style={styles.menuText}>Other Username:</Text>
              <TextInput
                value={this.state.addChatUsername}
                onChangeText={username =>
                  this.setState({addChatUsername: username})
                }
                style={styles.textInput}></TextInput>
            </View>
            <View style={styles.sessionMenu}>
              <MenuOption
                style={styles.menuConfirm}
                onSelect={() => this.createUserSession()}>
                <Text style={styles.menuText}>Add</Text>
              </MenuOption>
              <MenuOption
                style={styles.menuBack}
                onSelect={() => this.setState({popupOpen: false})}>
                <Text style={styles.menuText}>Back</Text>
              </MenuOption>
            </View>
          </MenuOptions>
        </Menu>
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
  addChat: {
    height: screenHeight / 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: lightColor,
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
  menuText: {
    fontSize: screenHeight / 20,
    color: textColor,
    textAlign: 'center',
  },
  sessionMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkColor,
    borderBottomWidth: 5,
    borderColor: lightColor,
  },
  menuBack: {
    flex: 1,
    alignItems: 'center',
    borderRight: 2,
    borderRightWidth: 5,
    borderColor: lightColor,
  },
  menuConfirm: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 5,
    borderLeftWidth: 5,
    borderColor: lightColor,
  },
  menuInput: {
    backgroundColor: darkColor,
    padding: screenWidth / 20,
    borderColor: lightColor,
    borderWidth: 5,
  },
  textInput: {
    //marginTop:40,
    borderColor: '#AAAFBB',
    backgroundColor: lightColor,
    paddingLeft: 5,
    borderWidth: 2,
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    color: '#AAAFBB',
  },
});
