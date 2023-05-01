/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from 'axios';
import React from 'react';
import settings from '../settings.json';
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

export default class Login extends React.Component<any, any> {
  constructor(props: {}) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      username: '',
      loginMode: 'Login',
      errorMessage: '',
      tabStyles: StyleSheet.create({
        registerHighlight: {
          backgroundColor: '#222233',
        },
        loginHighlight: {
          backgroundColor: '#333344',
        },
        displayLogin: {
          display: 'flex',
        },
        displayRegister: {
          display: 'none',
        },
      }),
    };
  }
  setTabStyles() {
    this.setState((prevState: any) => {
      return {
        tabStyles: StyleSheet.create({
          registerHighlight: {
            backgroundColor:
              prevState.loginMode == 'Login' ? '#222233' : '#333344',
          },
          loginHighlight: {
            backgroundColor:
              prevState.loginMode == 'Login' ? '#333344' : '#222233',
          },
          displayLogin: {
            display: prevState.loginMode == 'Login' ? 'flex' : 'none',
          },
          displayRegister: {
            display: prevState.loginMode == 'Login' ? 'none' : 'flex',
          },
        }),
      };
    });
  }
  changeTabs(buttonPressed: string) {
    if (buttonPressed != this.state.loginMode) {
      this.setState({loginMode: buttonPressed});
    }
    this.setTabStyles();
  }
  submit() {
    console.log('A');
    if (this.state.username.length <= 0) {
      this.setState({errorMessage: '*Username is empty'});
      return false;
    }
    if (this.state.password.length <= 0) {
      this.setState({errorMessage: '*Password is empty'});
      return false;
    }
    if (
      this.state.loginMode == 'Register' &&
      this.state.confirmPassword != this.state.password
    ) {
      this.setState({errorMessage: '*Passwords do not match'});
      return false;
    }
    let data = {
      requestType: this.state.loginMode.toLowerCase(),
      username: this.state.username,
      password: this.state.password,
    };
    const config = {
      method: 'post',
      data: data,
      url: 'http://' + settings.serverAddress + '/ChatApp/account.php',
    };
    axios(config)
      .then(res => {
        if (res.data.success) {
          this.props.onSubmit(res.data.account);
          this.setState({errorMessage: ''});
          console.log(res.data.account);
        } else {
          this.setState({errorMessage: res.data.err});
          console.log(res.data.err);
        }
      })
      .catch(error => {
        console.log(error, 'error');
      });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.tabs}>
          <Pressable
            style={[styles.loginTab, this.state.tabStyles.loginHighlight]}
            onPress={() => this.changeTabs('Login')}>
            <Text style={styles.tabText}>Login</Text>
          </Pressable>
          <Pressable
            style={[styles.registerTab, this.state.tabStyles.registerHighlight]}
            onPress={() => this.changeTabs('Register')}>
            <Text style={styles.tabText}>Register</Text>
          </Pressable>
        </View>
        <View style={[styles.textFields, this.state.tabStyles.displayLogin]}>
          <TextInput
            selectTextOnFocus={true}
            autoCorrect={false}
            autoComplete="username"
            style={styles.textInput}
            onChangeText={(text: string) => this.setState({username: text})}
            placeholder=" Username"
            placeholderTextColor="#AAAFBBBB"
          />
          <TextInput
            selectTextOnFocus={true}
            autoComplete="password"
            secureTextEntry
            style={styles.textInput}
            onChangeText={(text: string) => this.setState({password: text})}
            placeholder=" Password"
            placeholderTextColor="#AAAFBBBB"
          />
        </View>
        <View style={[styles.textFields, this.state.tabStyles.displayRegister]}>
          <TextInput
            selectTextOnFocus={true}
            autoCorrect={false}
            autoComplete="username"
            style={styles.textInput}
            onChangeText={(text: string) => this.setState({username: text})}
            placeholder="  Username"
            placeholderTextColor="#AAAFBBBB"
          />
          <TextInput
            selectTextOnFocus={true}
            autoComplete="password"
            secureTextEntry
            style={styles.textInput}
            onChangeText={(text: string) => this.setState({password: text})}
            placeholder="  Password"
            placeholderTextColor="#AAAFBBBB"
          />
          <TextInput
            selectTextOnFocus={true}
            autoComplete="password"
            secureTextEntry
            style={styles.textInput}
            onChangeText={(text: string) =>
              this.setState({confirmPassword: text})
            }
            onSubmitEditing={() => this.submit()}
            placeholder="  Confirm Password"
            placeholderTextColor="#AAAFBBBB"
          />
        </View>
        <View style={{backgroundColor: '#333344', width: screenWidth / 1.5}}>
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        </View>
        <Pressable style={styles.loginButton} onPress={() => this.submit()}>
          <Text style={styles.submitText}>{this.state.loginMode}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
  },
  textFields: {
    height: screenHeight / 2,
    width: screenWidth / 1.5,
    backgroundColor: '#333344',
    justifyContent: 'space-evenly',
  },
  textInput: {
    //marginTop:40,
    borderColor: '#AAAFBB',
    paddingLeft: 5,
    borderWidth: 2,
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    color: '#AAAFBB',
  },
  loginButton: {
    backgroundColor: '#222233',
    alignItems: 'center',
    width: screenWidth / 1.5,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tabs: {
    flexDirection: 'row',
  },
  loginTab: {
    padding: 10,
    borderTopLeftRadius: 20,
    backgroundColor: '#333344',
    width: screenWidth / 3,
    flexDirection: 'row',
  },
  registerTab: {
    padding: 10,
    borderTopRightRadius: 20,
    backgroundColor: '#222233',
    width: screenWidth / 3,
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
