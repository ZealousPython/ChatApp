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
  TouchableHighlight,
Dimensions,} from 'react-native';



let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;
export default class App extends React.Component <any,any>{
  constructor(props: {}){
    super(props);
    this.state = {
      text:"",
    }
  }
  componentDidMount(): void {
    
  }
  makeText(){
    return (<Text>{this.state.text}</Text>);
  }
  render(){
    return (
    <SafeAreaView style={styles.mainContainer}>
      <Login></Login>
    </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    backgroundColor:"black"
  },
});
