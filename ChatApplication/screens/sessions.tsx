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

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;
const lightColor = '#333344';
const darkColor = '#222233';
const lighterColor = '#444455';
const textColor = '#AAAFBB';
export default class MainWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      sessionID: props.sessionInfo.session_id,
      sessionName: props.sessionInfo.session_name,
      otherUserId: props.sessionInfo.other_user_id,
      otherUsername: props.sessionInfo.other_user_name,
      session: props.sessionInfo,
      enterChat: props.enterChat,
    };
  }
  componentDidMount(): void {}
  render() {
    return (
      <Pressable style={styles.mainContainer} onPress={this.state.enterChat}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.sessionText}>{this.state.sessionName}</Text>
          <Text style={styles.userText}>{this.state.otherUsername}</Text>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: screenHeight / 10 - 2,
    width: screenWidth,
    paddingLeft: screenWidth / 7,
    paddingRight: screenWidth / 20,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: lightColor,
  },
  sessionText: {
    flex: 1,
    textAlign: 'left',
    color: '#AAAFBB',
    fontSize: screenHeight / 25,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#AA3333',
    textAlign: 'center',
  },
  userText: {
    paddingTop: screenHeight / 20,
    color: '#AAAFBB',
    fontSize: screenHeight / 40,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textAlign: 'right',
    padding: 10,
  },
});
