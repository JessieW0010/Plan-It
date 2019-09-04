import React, { useState } from "react";
import {
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	SafeAreaView,
	Button,
	View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function RegisterForm({ navigation }) {
	const [state, setState] = useState({
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		password: ""
	});

	const handleSubmit = () => {
		const request = new Request("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(state)
		});

		fetch(request)
			.then(response => {
				// response.ok is true if User has successfully been INSERTED
				if (response.ok) {
					navigation.navigate("Dashboard");
				}
			})
			.catch(err => console.log(err));
	};

	return (
		<KeyboardAvoidingView bahaviour="padding" style={styles.container}>
			<View style={styles.btnView}>
				<Button title="Cancel" onPress={() => navigation.navigate("Login")} />
				<Button title="Save" onPress={() => handleSubmit()} />
			</View>
			<View>
				<Text>First Name:</Text>
				<TextInput
					style={styles.textInput}
					value={state.firstName}
					onChangeText={text => setState({ ...state, first_name: text })}
				/>
				<Text>Last Name:</Text>
				<TextInput
					style={styles.textInput}
					onChangeText={text => setState({ ...state, last_name: text })}
				/>
				<Text>Username:</Text>
				<TextInput
					style={styles.textInput}
					onChangeText={text => setState({ ...state, username: text })}
				/>
				<Text>Email:</Text>
				<TextInput
					style={styles.textInput}
					onChangeText={text => setState({ ...state, email: text })}
				/>
				<Text>Password:</Text>
				<TextInput
					style={styles.textInput}
					onChangeText={text => setState({ ...state, password: text })}
				/>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center"
	},
	textInput: {
		height: 40,
		borderColor: "#000",
		borderWidth: 1,
		width: 200
	},
	button: {
		backgroundColor: "#FD6592",
		height: 40
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "bold"
	},
	btnView: {
		position: "absolute",
		top: 35,
		justifyContent: "space-between",
		flexDirection: "row",
		justifyContent: "space-between",
		width: 350
	}
});
