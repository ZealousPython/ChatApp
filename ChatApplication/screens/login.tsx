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
    Pressable,
    Dimensions,} 
from 'react-native';



export default class Login extends React.Component <any,any>{
    constructor(props: {}){
        super(props);
        this.state = {
            password:"hello",
            username:"password",
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
            url: 'http://localhost:0080/ChatApp/index.php',
          };
          axios(config).then(res=>{
            console.log(res.data.requestType)
          }).catch( (error) => {
            console.log(error);
          });
    }

    render(){
        return (
            <View>
                <Pressable onPress={()=>this.submit()}>
                    <Text style={{fontSize:40}}>Submit</Text>
                </Pressable>
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
