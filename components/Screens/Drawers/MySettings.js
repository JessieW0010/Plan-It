import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert
} from "react-native";
import MenuBtn from "../../Buttons/Menubtn";
import UsernameForm from "./SettingForms/UsernameForm";
import EmailForm from "./SettingForms/EmailForm";
import PasswordForm from "./SettingForms/PasswordForm";
import ProfilePicForm from "./SettingForms/ProfilePicForm";
import DeleteForm from "./SettingForms/DeleteForm";

import { connect } from "react-redux";
import { resetStore } from "../../../store/actions/resetStoreAction";
import {
  changeUsername,
  changeEmail,
  changePassword,
  changeProfilePic,
  deleteAccount
} from "../../../store/actions/userAction";
import { withTheme } from "react-native-elements";

function SettingsScreen(props) {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate("Login");
    props.dispatch(resetStore());
  };

  const onUpdateUsername = (user, newUsername) => {
    props.dispatch(changeUsername(user, newUsername));
    Alert.alert("Updated username sucessfully!");
    // Initiate the modal response or error
  };

  const onUpdateEmail = (user, newEmail) => {
    props.dispatch(changeEmail(user, newEmail));
    Alert.alert("Updated email sucessfully!");
    // Initiate the modal response or error
  };

  const onUpdatePassword = (user, password) => {
    props.dispatch(changePassword(user, password));
    Alert.alert("Updated password sucessfully!");
    // Initiate the modal response or error
  };

  const onUpdateProfilePicture = (user, profilePicture) => {
    props.dispatch(changeProfilePic(user, profilePicture));
    Alert.alert("Updated profile picture sucessfully!");
    // Initiate the modal response or error
  };

  const onDeleteAccount = user => {
    props.dispatch(deleteAccount(user));
    props.navigation.navigate("Login");
    // handleLogout();
  };

  return (
    <ImageBackground
      source={require("../../../assets/plant1.jpg")}
      style={{ width: "100%", height: "100%" }}
    >
      <View
        style={{
          position: "absolute",
          backgroundColor: "white",
          opacity: 0.8,
          width: "100%",
          height: Dimensions.get("screen").height
        }}
      />
      <View style={styles.container}>
        <MenuBtn navigation={props.navigation} />
        <View style={styles.upperTab}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutBtnTxt}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomTab}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
          >
            {console.log(props.isUserUpdated)}
            <UsernameForm
              onSubmit={onUpdateUsername}
              currentUsername={props.user.username}
              user_id={props.selectedUser}
            />
            <EmailForm
              onSubmit={onUpdateEmail}
              currentEmail={props.user.email}
              user_id={props.selectedUser}
            />
            <PasswordForm
              onSubmit={onUpdatePassword}
              user_id={props.selectedUser}
            />
            <ProfilePicForm
              onSubmit={onUpdateProfilePicture}
              user_id={props.selectedUser}
            />
            <DeleteForm
              onSubmit={onDeleteAccount}
              user_id={props.selectedUser}
            />
            {/* update username */}
            {/* update profile picture */}
            {/* update email */}
            {/* update password */}
            {/* delete account */}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "skyblue"
  },
  upperTab: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "lightgreen",
    width: "100%"
    // marginTop: "10%"
  },
  bottomTab: {
    flex: 4,
    // backgroundColor: "blue",
    width: "100%"
  },
  scrollContainer: {
    width: "100%"
  },
  scrollContent: {
    paddingBottom: 10
    // backgroundColor: "yellow"
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 10,
    marginTop: 10,
    width: "40%"
  },
  logoutBtnTxt: {
    color: "white",
    fontFamily: "Avenir-Light",
    fontSize: 20
  },
  title: {
    fontFamily: "Avenir-Light",
    fontSize: 25,
    marginTop: 20
  }
});

function mapStateToProps(state) {
  const { selectedUser, gettingUserData } = state;
  const { isFetchingUser, user, isUserUpdated } = gettingUserData[
    selectedUser
  ] || {
    isFetchingUser: true,
    user: {},
    isUserUpdated: true
  };
  return {
    selectedUser,
    isFetchingUser,
    user,
    isUserUpdated
  };
}

export default connect(mapStateToProps)(SettingsScreen);
