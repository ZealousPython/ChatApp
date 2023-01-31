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
let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;


export default class Login extends React.Component <any,any>{
  
    constructor(props: {}){
        super(props);
        this.state = {
          
            password:"hello",
            username:"wild",
            loginMode:'Login',
            errorMessage:"*Wrong password entered",
        }
    }
    submit(){
      console.log("submit");
        let data = {
            requestType:"login",
            username:'wild',
            password:'world',
          }
          const config = {
            method: 'post',
            data: data,
            url: 'http://192.168.35.166/ChatApp/account.php',
          };
          axios(config).then(res=>{
            if (res.data.success){
                console.log(res.data.account)
            }
            else{
                console.log(res.data.err)
            }
          }).catch( (error) => {
            console.log(error);
            console.log(error.response);
          });
    }

    render(){
        
        return (
            <View style={styles.mainContainer}>
                <View>
                  <Pressable style={styles.loginTab}>
                    <Text style={styles.submitText}>Login</Text>
                  </Pressable>
                </View>
                <View style={styles.textFields}>
                  <TextInput selectTextOnFocus={true} autoCorrect={false} autoComplete="username" style={styles.textInput} onChangeText={(text:string)=> this.setState({username:text})}placeholder="Username"/>
                  <TextInput selectTextOnFocus={true} autoComplete="password" secureTextEntry style={styles.textInput} onChangeText={(text:string)=> this.setState({password:text})}placeholder="Password"/>
                  <Text style={styles.errorText}>{this.state.errorMessage}</Text>
                </View>
                <Pressable style={styles.loginButton}onPress={()=>this.submit()}>
                    <Text style={styles.submitText}>{this.state.loginMode}</Text>
                </Pressable>
            </View>
        );
    }

}

const styles = StyleSheet.create({
  mainContainer: {
   flex:1,
   justifyContent:'center',
   height:screenHeight,
   width:screenWidth,
   alignItems:'center'
   
  },
  textFields:{
    height:screenHeight/2,
    width:screenWidth/1.5,
    backgroundColor:"#333344",
    justifyContent:'space-evenly',
  },
  textInput:{
    //marginTop:40,
    borderColor:"#AAAFBB",
    borderWidth:2,
    fontSize:20,
  },
  loginButton:{
    
    
    backgroundColor:"#222233",
    alignItems:'center',
    width:screenWidth/1.5,
    justifyContent:'center',
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },
  submitText:{
    color:"#AAAFBB",
    fontSize:36,
    fontFamily:'Roboto',
    padding:10,
    alignItems:'center'
  },
  loginTab:{
    width:screenWidth/3,
  },
  errorText:{
    fontSize:14,
    color:"#AA3333",
    textAlign:"center",
  },
});
