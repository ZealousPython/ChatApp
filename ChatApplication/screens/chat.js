/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from 'axios';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImages} from '@fortawesome/free-regular-svg-icons';
import {
  faGears,
  faChevronLeft,
  faShareFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import ImagePicker from 'react-native-image-picker';
import settings from '../settings.json';
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;
const lightColor = '#333344';
const darkColor = '#222233';
const lighterColor = '#444455';
const textColor = '#AAAFBB';
const maxImageHeight = (screenHeight / 5) * 4 - 20;
const maxImageWidth = (screenWidth / 5) * 4 - 20;
const chatStyles = StyleSheet.create({
  rightChatView: {
    alignItems: 'flex-end',
    backgroundColor: lighterColor,
    alignSelf: 'flex-end',
    maxWidth: (screenHeight / 5) * 4 + 14,
    padding: 10,
    borderRadius: 20,
    margin: 4,
    borderBottomRightRadius: 0,
    marginLeft: screenWidth - (screenWidth / 2 + 18),
  },
  leftChatView: {
    backgroundColor: lightColor,
    borderBottomLeftRadius: 0,
    padding: 10,
    alignSelf: 'flex-start',
    maxWidth: (screenHeight / 5) * 4 + 14,
    borderRadius: 20,
    alignItems: 'flex-start',
    margin: 4,
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
import {useKeyboard} from '@react-native-community/hooks';
const ChatImage = props => {
  return (
    <Image
      style={{width: props.width, height: props.height}}
      source={props.imageSource}
    />
  );
};
const ChatText = props => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  if (props.imageSource != null)
    Image.getSize(props.imageSource.uri, (Width, Height) => {
      //console.log(Height, Width, maxImageHeight, maxImageWidth);
      let newHeight = Height;
      let newWidth = Width;
      let tooTall = maxImageHeight * (Width / Height) > maxImageWidth;
      if (Height > Width && Height > maxImageHeight) {
        newHeight = maxImageHeight;
        newWidth = maxImageHeight * (Width / Height);
      }
      if ((Width >= Height && Width > maxImageWidth) || tooTall) {
        newHeight = maxImageWidth * (Height / Width);
        newWidth = maxImageWidth;
      }
      setWidth(newWidth);
      setHeight(newHeight);
    });
  return (
    <View
      style={
        props.currentUser ? chatStyles.rightChatView : chatStyles.leftChatView
      }>
      <Text style={chatStyles.text}>{props.text}</Text>
      <ChatImage
        height={height}
        width={width}
        imageSource={props.imageSource}
      />

      <Text style={chatStyles.smallText}>{props.timeStamp}</Text>
    </View>
  );
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionID: props.sessionID,
      userID: props.userID,
      linesBatchSize: 50,
      lines: [],
      addingLines: false,
      message: '',
      messageImage: null,
      keyBoardHeight: screenHeight / 3,
      keyboardShown: false,
    };
  }
  componentDidMount() {
    //this.addLines();
  }

  async addLines() {
    console.log('ADD');
    if (!this.state.addingLines) {
      console.log('ADD2');
      this.setState({addingLines: true});
      let data = {
        requestType: 'retriveData',
        session_id: this.state.sessionID,
        userID: this.state.userID,
        linesRead: this.state.lines.length,
        linesToRead: this.state.linesBatchSize,
      };
      console.log(this.state.lines.length);
      const config = {
        method: 'post',
        data: data,
        url: 'http://' + settings.serverAddress + '/ChatApp/chat.php',
      };
      const result = await axios(config)
        .then(res => {
          if (res.data.success) {
            console.log(res.data.image);
            this.setState({lines: [...this.state.lines, ...res.data.messages]});
          } else {
            console.log('error');
            console.log(res.data.dat);
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.setState({addingLines: false});
    }
  }
  async sendMessage() {
    await this.setState({lines: []});
    await this.addLines();
  }
  componentDidMount() {
    this.addLines();
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <FlatList
          style={styles.chatView}
          inverted={true}
          data={this.state.lines}
          onEndReached={() => this.addLines()}
          renderItem={({item}) => {
            return (
              <ChatText
                imageSource={item.image}
                text={item.message}
                timeStamp={item.time}
                currentUser={item.thisUser}
              />
            );
          }}
          keyExtractor={item => item.id}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputBar}>
            <View style={styles.textInputBar}>
              <TextInput
                style={[styles.textInput]}
                selectTextOnFocus={true}
                autoCorrect={false}
                onChangeText={text => this.setState({message: text})}
                placeholder={'message '}
                placeholderTextColor="#AAAFBBBB"
              />
              <Pressable style={[styles.imageButton]}>
                <FontAwesomeIcon
                  style={styles.tabText}
                  icon={faImages}
                  color={textColor}
                  size={screenHeight / 19}
                />
              </Pressable>
            </View>
            <Pressable
              style={[styles.submitButton]}
              onPress={() => this.sendMessage()}>
              <FontAwesomeIcon
                style={styles.tabText}
                icon={faShareFromSquare}
                color={textColor}
                size={screenHeight / 19}
              />
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: screenWidth,
    height: (screenHeight / 10) * 8.5,
  },
  chatView: {
    height: (screenHeight / 10) * 7.5,
    //flex: 80,
    width: screenWidth,
  },
  imageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    backgroundColor: lightColor,
    borderColor: textColor,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    fontSize: 20,
    borderLeftWidth: 3,
    borderRightWidth: 0,
  },
  textInput: {
    flex: 8,
    borderColor: '#AAAFBB',
    fontSize: 20,
    color: '#AAAFBB',
  },
  textInputBar: {
    flex: 7,
    borderWidth: 2,
    borderColor: textColor,
    borderRadius: 20,
    height: screenHeight / 10 - 4,
    flexDirection: 'row',
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
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight / 12 - 4,
    width: screenHeight / 12 - 4,

    backgroundColor: lighterColor,
    borderRadius: 80,
  },
});
