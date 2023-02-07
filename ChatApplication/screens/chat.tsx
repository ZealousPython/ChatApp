/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from 'axios';
import React, {useState} from 'react';
//import type {} from 'react';

import {
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;
const lightColor = '#333344';
const darkColor = '#222233';
const lighterColor = '#444455';
const textColor = '#AAAFBB';
const maxImageHeight = 500;
const maxImageWidth = 500;
const chatStyles = StyleSheet.create({
  rightChatView: {
    alignItems: 'flex-end',
    backgroundColor: lighterColor,
    padding: 2,
    width: screenWidth,
    borderRadius: 10,
  },
  leftChatView: {
    backgroundColor: lightColor,
    padding: 2,
    width: screenWidth,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  text: {
    color: textColor,
    fontSize: 18,
  },
  smallText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
});

const ChatText = (props: any) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  return (
    <View
      style={
        props.currentUser ? chatStyles.rightChatView : chatStyles.leftChatView
      }>
      {Image.getSize(props.imageSource, (Width, Height) => {
        setWidth(
          Width > maxImageWidth ? maxImageWidth * (width / height) : Width,
        );
        setHeight(
          Height > maxImageHeight ? maxImageHeight * (height / width) : Height,
        );
      })}
      <Text style={chatStyles.text}>{props.text}</Text>
      <Image
        style={{width: width, height: height}}
        source={props.imageSource}
      />
      <Text style={chatStyles.smallText}>{props.timeStamp}</Text>
    </View>
  );
};

export default class Chat extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      sessionID: props.sessionID,
      userID: props.userID,
      linesAdded: 50,
      lines: [],
      addingLines: false,
    };
  }
  componentDidMount(): void {
    this.addLines();
  }

  async addLines() {
    if (!this.state.addingLines) {
      this.setState({addingLines: true});
      let data = {
        requestType: this.state.loginMode.toLowerCase(),
        username: this.state.username,
        password: this.state.password,
      };
      const config = {
        method: 'post',
        data: data,
        url: 'http://192.168.144.166/ChatApp/account.php',
      };
      const result = await axios(config)
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
          console.log(error);
        });
      this.setState({addingLines: false});
    }
  }
  render() {
    return (
      <FlatList
        style={styles.mainContainer}
        inverted
        data={this.state.lines}
        onEndReached={() => this.addLines()}
        renderItem={({item}) => (
          <ChatText
            imageSource={item.image}
            text={item.message}
            timeStamp={item.time}
            currentUser={item.thisUser}
          />
        )}
        keyExtractor={item => item.id}
      />
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: (screenHeight / 10) * 8.5,
    width: screenWidth,
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
