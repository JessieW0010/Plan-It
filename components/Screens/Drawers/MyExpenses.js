import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ImageBackground,
	Dimensions
} from "react-native";
import MenuBtn from "../../Buttons/Menubtn";
import AddBtn from "../../Buttons/Addbtn";
import ExpensesCards from "./ExpensesCards";

import { connect } from "react-redux";
import { updateTransaction } from "../../../store/actions/userAction";

function MyExpensesScreen(props) {
	const handleUpdate = transactionId => {
		props.dispatch(updateTransaction(props.selectedUser, transactionId));
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
					opacity: 0.5,
					width: "100%",
					height: Dimensions.get("screen").height
				}}
			/>
			<MenuBtn navigation={props.navigation} />
			<View style={styles.container}>
				<Text style={styles.title}>Expenses</Text>
			</View>
			<ScrollView>
				<ExpensesCards
					items={props.user_expenses}
					onUpdate={handleUpdate}
					user={props.selectedUser}
				/>
			</ScrollView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 200,
		alignItems: "center"
	},
	TextInput: {
		borderColor: "black",
		borderBottomWidth: 1,
		width: 100
	},
	title: {
		fontFamily: "Avenir-Light",
		fontSize: 25
	}
});

function mapStateToProps(state) {
	const { selectedUser, gettingUserData } = state;
	const { isFetchingUser, user_expenses } = gettingUserData[selectedUser] || {
		isFetchingUser: true,
		user_expenses: []
	};

	return {
		selectedUser,
		isFetchingUser,
		user_expenses
	};
}

export default connect(mapStateToProps)(MyExpensesScreen);
