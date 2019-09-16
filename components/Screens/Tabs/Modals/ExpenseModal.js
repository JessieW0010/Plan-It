import React, { useState, useEffect } from "react";
import {
	Modal,
	View,
	Text,
	TouchableHighlight,
	Dimensions,
	TextInput,
	StyleSheet,
	ScrollView,
	TouchableOpacity
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { formatDate, formatTime } from "../../../../helpers/formatDateTime";

import { CheckBox, withTheme } from "react-native-elements";
// import getFriends from "../../../../helpers/getFriends";
const width = Dimensions.get("screen").width;

export default function ExpenseModal(props) {
	const {
		title,
		form,
		setForm,
		handleSubmit,
		tripUsers: propsTripUsers
	} = props;
	const tripUsers = {};
	form.users = form.users || [];

	const [isDateTimePickerVisible, setDateTimeVisibility] = useState(false);

	propsTripUsers &&
		propsTripUsers.forEach(e => {
			tripUsers[e.id] = false;
		});
	const [checkedTripUsers, setCheckedTripUsers] = useState(tripUsers);

	return (
		<View style={styles.content}>
			<Text style={styles.title}>{title}</Text>
			<Text style={[styles.textTitles, styles.text]}>Name:</Text>
			<TextInput
				style={styles.textInput}
				value={form && form.name ? form.name : ""}
				onChangeText={text => setForm({ ...form, name: text })}
			/>

			{!form.expense_date ? (
				<View style={[styles.datePicker, { width: "100%" }]}>
					<TouchableOpacity
						style={[styles.datePickerButton, { width: "100%" }]}
						onPress={() =>
							setDateTimeVisibility({
								...isDateTimePickerVisible,
								end: true
							})
						}
					>
						<Text style={{ color: "white", fontFamily: "Avenir" }}>
							Expense Date
						</Text>
					</TouchableOpacity>
					<DateTimePicker
						customCancelButtonIOS={
							<View style={styles.dateButton}>
								<Text style={styles.dateText}>Cancel</Text>
							</View>
						}
						customConfirmButtonIOS={
							<View style={styles.dateButton}>
								<Text style={styles.dateText}>Confirm</Text>
							</View>
						}
						mode={"date"}
						datePickerContainerStyleIOS={{ borderRadius: 0 }}
						titleIOS={"Pick a start date"}
						isVisible={isDateTimePickerVisible.end}
						onConfirm={date => {
							setForm({ ...form, expense_date: date });
							setDateTimeVisibility(false);
						}}
						onCancel={() => setDateTimeVisibility(false)}
					/>
				</View>
			) : (
				<TouchableOpacity
					style={styles.datePickerButton}
					onPress={() => {
						setForm({ ...form, expense_date: "" });
						setDateTimeVisibility(true);
					}}
				>
					<Text style={styles.datePickerButtonText}>
						{formatDate(form.expense_date)}
					</Text>
				</TouchableOpacity>
			)}

			<Text style={[styles.textTitles, styles.text]}>Amount:</Text>
			<TextInput
				style={styles.textInput}
				value={form && form.amount_in_cents}
				onChangeText={text => setForm({ ...form, amount_in_cents: text })}
				keyboardType="decimal-pad"
			/>
			{propsTripUsers && propsTripUsers.length > 0 ? (
				<View style={styles.friendsContainer}>
					<ScrollView contentContainerStyle={styles.checkBox}>
						{propsTripUsers.map(usr => {
							return (
								<CheckBox
									textStyle={{
										fontFamily: "Avenir",
										fontSize: 16,
										fontWeight: "normal",
										color: "black"
									}}
									containerStyle={{
										borderRadius: 0,
										backgroundColor: "white",
										width: "100%",
										marginLeft: 0,
										height: 45,
										borderColor: "white"
									}}
									key={usr.id}
									title={usr.first_name + " " + usr.last_name}
									checked={checkedTripUsers[usr.id]}
									onPress={() => {
										if (checkedTripUsers[usr.id]) {
											setForm({
												...form,
												users: form.users.filter(
													tripUserId => tripUserId !== usr.id
												)
											});
										} else {
											if (form.users && form.users.length) {
												let newUsers = [usr.id, ...form.users];
												setForm({ ...form, users: newUsers });
											} else {
												setForm({ ...form, users: [usr.id] });
											}
										}

										setCheckedTripUsers({
											...checkedTripUsers,
											[usr.id]: !checkedTripUsers[usr.id]
										});
									}}
								/>
							);
						})}
					</ScrollView>
				</View>
			) : (
				<Text>No trip users to add to expense</Text>
			)}

			<TouchableHighlight style={styles.submit}>
				<Text
					style={{ color: "white" }}
					onPress={() => {
						handleSubmit("expense");
					}}
				>
					Submit
				</Text>
			</TouchableHighlight>
		</View>
	);
}
const styles = StyleSheet.create({
	textTitles: {
		fontSize: 15,
		width: "100%",
		marginTop: "5%"
	},
	text: {
		fontFamily: "Avenir-BookOblique"
	},
	close: {
		position: "absolute",
		right: 20,
		top: 20
	},
	content: {
		width: "90%",
		alignItems: "center"
	},
	textInput: {
		width: "100%",
		height: 40,
		borderColor: "#000",
		borderBottomWidth: 1,
		marginBottom: "2%"
	},
	title: {
		fontSize: 24,
		paddingBottom: "10%",
		paddingRight: "10%"
	},
	submit: {
		width: "100%",
		height: width / 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "black"
	},
	friendsList: {
		backgroundColor: "yellow",
		height: "30%"
	},
	checkBox: {
		flex: 1,
		width: "100%",
		height: "100%",
		backgroundColor: "white"
		// height: 200
	},
	friendsContainer: {
		width: "100%",
		height: 200,
		marginBottom: "5%",
		marginTop: "5%"
	},
	datePickerButton: {
		width: "100%",
		height: width / 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "black"
	},
	dateButton: {
		backgroundColor: "black",
		alignItems: "center",
		width: "100%",
		height: "100%",
		justifyContent: "center"
	},
	dateText: {
		fontFamily: "Avenir",
		fontSize: 15,
		color: "white"
	},
	datePickerContainer: {
		width: "100%",
		paddingTop: 2,
		height: width / 9
	},
	datePickerButtonText: {
		fontSize: 15,
		fontFamily: "Avenir",
		color: "white"
	}
});
