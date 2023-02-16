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
import {faGears, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import ImagePicker from 'react-native-image-picker';
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
      console.log(Height, Width, maxImageHeight, maxImageWidth);
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
      lines: [
        {
          image: {
            uri: 'http://192.168.144.166/ChatApp/StoredFiles/ChatLogs/ChatImages/Lucca2.png',
          },
          message: '',
          time: '8:23',
          id: 0,
          thisUser: false,
        },
        {
          image: {
            uri: 'http://192.168.144.166/ChatApp/StoredFiles/ChatLogs/ChatImages/Lucca2.png',
          },
          message: '',
          time: '8:23',
          id: 3,
          thisUser: false,
        },
        {
          image: {
            uri: 'http://192.168.144.166/ChatApp/StoredFiles/ChatLogs/ChatImages/Lucca2.png',
          },
          message: '',
          time: '8:23',
          id: 2,
          thisUser: true,
        },
        {
          image: {
            uri: 'http://192.168.144.166/ChatApp/StoredFiles/ChatLogs/ChatImages/Lucca2.png',
          },
          message: '',
          time: '8:23',
          id: 4,
          thisUser: false,
        },
        {
          image: null,
          message: 'Hello World',
          time: '8:23',
          id: 1,
          thisUser: true,
        },
      ],
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
    if (!this.state.addingLines) {
      this.setState({addingLines: true});
      let data = {
        requestType: 'retriveData',
        session_id: this.state.sessionID,
        userID: this.state.userID,
        linesRead: this.state.lines.length,
        linesToRead: this.state.linesBatchSize,
      };
      const config = {
        method: 'post',
        data: data,
        url: 'http://192.168.144.166/ChatApp/chat.php',
      };
      const result = await axios(config)
        .then(res => {
          if (res.data.success) {
          } else {
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
      <View style={styles.mainContainer}>
        <FlatList
          style={styles.chatView}
          inverted={false}
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
    width: screenWidth / 6,
    backgroundColor: lightColor,
    borderColor: '#AAAFBB',
    borderWidth: 2,
    fontSize: 20,
    borderLeftWidth: 1,
    borderRightWidth: 0,
  },
  textInput: {
    flex: 1,
    borderColor: '#AAAFBB',
    borderWidth: 2,
    fontSize: 20,
    borderLeftWidth: 0,
    borderRightWidth: 0,

    color: '#AAAFBB',
  },
  textInputBar: {
    width: screenWidth,
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
});
