/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import axios from "axios";
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
    TouchableHighlight,
    Dimensions,} 
from 'react-native';



export default class Login extends React.Component <any,any>{
    constructor(props: {}){
        super(props);
        this.state = {
            password:"",
            username:"",
        }
    }
    submit(){
        let data = {
            requestType:"login",
            username:this.state.username,
            password:this.state.password,
          }
          const config = {
            method: 'post',
            data: data,
            url: 'http://192.168.35.166/ChatApp/acountlogin.php',
          };
          axios(config).then(res=>{
            console.log(res.data.somedata)
            this.setState({text:res.data.somedata})
          }).catch( (error) => {
            console.log(error);
          });
    }

    render(){
        return (
            <View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
