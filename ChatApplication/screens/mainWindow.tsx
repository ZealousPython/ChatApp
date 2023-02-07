/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from 'axios';
import React from 'react';
//import type {} from 'react';
import Chats from './displayChats';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faComments} from '@fortawesome/free-regular-svg-icons';
import {faGears, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
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
      account: props.account,
      activeScreen: 'chats',
      titleText: 'Chats',
      backup: false,
      navStyles: StyleSheet.create({
        chatBackground: {backgroundColor: lighterColor},
        settingsBackground: {backgroundColor: lightColor},
      }),
    };
    console.log(props.account, 'MainWindowAccount');
  }
  mainContent() {
    if (this.state.activeScreen == 'chats') {
      return <Chats account={this.state.account}></Chats>;
    }
    return <></>;
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.title}>
          <Pressable
            style={[
              {
                flexDirection: 'row',
                width: screenWidth / 5,
                marginTop: screenHeight / 60,
              },
              {display: this.state.backup ? 'flex' : 'none'},
            ]}>
            <FontAwesomeIcon icon={faChevronLeft} color={textColor} size={50} />
          </Pressable>
          <Text style={styles.titleText}>{this.state.titleText}</Text>
        </View>
        <View style={styles.mainContent}>{this.mainContent()}</View>

        <View style={styles.navbar}>
          <Pressable
            style={[styles.navChat, this.state.navStyles.chatBackground]}>
            <FontAwesomeIcon
              style={styles.tabText}
              icon={faComments}
              color={textColor}
              size={screenHeight / 35}
            />
          </Pressable>
          <Pressable
            style={[
              styles.navSettings,
              this.state.navStyles.settingsBackground,
            ]}>
            <FontAwesomeIcon
              style={styles.tabText}
              icon={faGears}
              color={textColor}
              size={screenHeight / 35}
            />
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: darkColor,
  },
  mainContent: {
    height: (screenHeight / 10) * 8.5,
    width: screenWidth,
    backgroundColor: darkColor,
  },
  title: {
    height: screenHeight / 10,
    width: screenWidth,
    backgroundColor: lightColor,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: lightColor,
  },
  navChat: {
    height: screenHeight / 20,
    width: screenWidth / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  navSettings: {
    paddingTop: 10,
    height: screenHeight / 20,
    width: screenWidth / 2,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  titleText: {
    fontFamily: 'bold',
    fontSize: 42,
    textAlign: 'left',
    width: (screenWidth / 5) * 4,
    color: textColor,
    //paddingLeft: screenWidth / 7,
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
    justifyContent: 'center',
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
