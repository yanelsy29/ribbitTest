import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Button, Linking, SafeAreaView, Alert } from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import { WebView } from 'react-native-webview';

export const URL = "https://api.cloudpayments.com/";
const headers = {
  "Content-Type": "application/json",
  "API-KEY": "5cc31beb901a2e00017617f8af9a9076ba7541969a5dfb79b17248d1",
  tenantName: "CANNACARD",
  DEVICE_OS: "ANDROID",
  DEVICE_ID: "",
  TIMEZONE: "America/Caracas",
  IP_ADDRESS: "",
};

export default class App extends React.Component {
  
  state = {
    redirectData: null,
  };

  render() {
    return(
      <SafeAreaView style={{ flex: 1, marginTop: 24 }}>
        <Button
          onPress={this._requestUrl}
          title="Open Ribbit"
        /> 
        {this._maybeRenderRedirectData()}
        <StatusBar style="auto" />
      </SafeAreaView>
    )
  };

  _requestUrl = async() => {
    //login
    var details = {
        'username': "blake@tigrepay.com",
        'password': "X332332x",
        'grant_type': 'password'
    };
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const response = await fetch(URL + "auth/oauth/token", {
      method: "POST",
      headers: Object.assign({}, headers, {
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: formBody,
    }).then(response => response.json())
    const url = `https://api.cloudpayments-staging.com/test-ribbit-widget/index2.html?token=${response.access_token}&tenantName=CANNACARD`
    this.setState({ redirectData: url });
    console.log(url)
  };


  _maybeRenderRedirectData = () => {
    if (!this.state.redirectData) {
      console.log("nothing")
      return;
    }
    return (
    <WebView originWhitelist={['*']} 
          source={{ uri: this.state.redirectData }} 
          javaScriptCanOpenWindowsAutomatically={true} 
          javaScriptEnabled={true}
          onMessage={(event)=> {
            console.log(JSON.parse(event.nativeEvent.data).type)
            if(JSON.parse(event.nativeEvent.data).type === "ENROLLMENT_SUCCESS")
              Alert.alert("Data",event.nativeEvent.data)
          }}
          onShouldStartLoadWithRequest={(navState)=>{
            Linking.openURL(navState.url)
            return false;
          }}
        />
    );
  };
  // useEffect(() => {
  //   (async () => {
      
  //     //login
  //     var details = {
  //         'username': "blake@tigrepay.com",
  //         'password': "X332332x",
  //         'grant_type': 'password'
  //     };
  //     var formBody = [];
  //     for (var property in details) {
  //         var encodedKey = encodeURIComponent(property);
  //         var encodedValue = encodeURIComponent(details[property]);
  //         formBody.push(encodedKey + "=" + encodedValue);
  //     }
  //     formBody = formBody.join("&");
  //     const response = await fetch(URL + "auth/oauth/token", {
  //       method: "POST",
  //       headers: Object.assign({}, headers, {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       }),
  //       body: formBody,
  //     }).then(response => response.json())

  //     console.log(`https://api.cloudpayments-staging.com/test-ribbit-widget/index2.html?token=${response.access_token}&tenantName=CANNACARD`)
  //   })()
  // }, [])
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
