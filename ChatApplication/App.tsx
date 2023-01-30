/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from "axios";
import React from 'react';
import Login from './screens/login'
//import type {} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,} from 'react-native';




export default class App extends React.Component <any,any>{
  constructor(props: {}){
    super(props);
    this.state = {
      text:"",
    }
  }
  componentDidMount(): void {
    let data = {
      somedata:"HELLO WORLD!!!!",
      username:"Hello",
      password:"world",
    }
    const config = {
      method: 'post',
      data: data,
      url: 'http://192.168.35.166/ChatApp/index.php',
    };
    axios(config).then(res=>{
      console.log(res.data.somedata)
      this.setState({text:res.data.somedata})
    }).catch( (error) => {
      console.log(error);
    });
  }
  makeText(){
    return (<Text>{this.state.text}</Text>);
  }
  render(){
    return (
    <View>
      <Login></Login>
    </View>
    );
  }

}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
