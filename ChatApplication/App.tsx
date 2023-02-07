/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from 'axios';
import React from 'react';
import Login from './screens/login';
import MainWindow from './screens/mainWindow';
import * as Keychain from 'react-native-keychain';
//import type {} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;
export default class App extends React.Component<any, any> {
  constructor(props: {}) {
    super(props);
    this.state = {
      uesrAccount: null,
    };
  }
  async componentDidMount() {
    let credential = await Keychain.getGenericPassword();
    if (credential) {
      //this.setState({userAccount: JSON.parse(credential.password)});
    }
  }
  onLogin(account: object) {
    Keychain.setGenericPassword('session', JSON.stringify(account));
    this.setState({userAccount: account});
  }
  makeLogin() {
    if (this.state.userAccount == null) {
      return (
        <Login
          onSubmit={(account: object) => {
            this.onLogin(account);
          }}></Login>
      );
    } else {
      return <MainWindow account={this.state.userAccount}></MainWindow>;
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        {this.makeLogin()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
});
