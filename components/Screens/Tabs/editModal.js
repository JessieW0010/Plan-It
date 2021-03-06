import React, { useState, useEffect } from "react";
import {
	Modal,
	View,
	Text,
	TouchableHighlight,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	TextInput,
	StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import {
	updateTripItem,
	deleteTripItem
} from "../../../store/actions/tripActions";
import getIds from "../../../helpers/getIds";

//Import modals:
import EventModal from "./Modals/EventModal";
import TodoModal from "./Modals/TodoModal";
import ExpenseModal from "./Modals/ExpenseModal";
import AddFriendsModal from "./addFriendsModal";

const editModal = function(props) {
	const [error, setError] = useState(false);
	const [invited, setInvited] = useState([]);
	const [addFriendsVisible, setFriendVisibility] = useState(false);

	const handleSubmit = () => {
		switch (props.mode) {
			case "events":
				props.dispatch(
					updateTripItem(props.selectedUser, props.selectedTrip, props.mode, {
						...props.form
					})
				);
				props.onClose();
				break;
			case "toDos":
				props.dispatch(
					updateTripItem(props.selectedUser, props.selectedTrip, props.mode, {
						...props.form
					})
				);
				props.onClose();
				break;
			case "expenses":
				props.dispatch(
					updateTripItem(props.selectedUser, props.selectedTrip, props.mode, {
						...props.form,
						users: getIds(invited)
					})
				);
				props.onClose();
				break;
		}
	};

	const deleteItem = form => {
		switch (props.mode) {
			case "events":
				props.dispatch(
					deleteTripItem(
						props.selectedUser,
						props.selectedTrip,
						props.mode,
						props.form.id
					)
				);
				props.onClose();
				break;
			case "expenses":
				if (invited.length > 0) {
					props.dispatch(
						updateTripItem(
							{ ...props.form, users: getIds(invited) },
							props.selectedUser,
							props.tripId
						)
					);
					props.onClose();
					break;
				} else {
					setError(true);
					break;
				}
		}
	};

	return (
		<View
			style={{
				marginTop: 22,
				alignItems: "center"
			}}
		>
			<Modal animationType="slide" transparent={true} visible={props.isVisible}>
				<ImageBackground
					source={require("../../../assets/plant2.jpg")}
					style={{
						flex: 1,
						marginTop: "5%",
						width: "100%",
						height: Dimensions.get("screen").height,
						alignItems: "center"
					}}
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
					<TouchableHighlight
						style={styles.close}
						onPress={() => {
							props.onClose();
						}}
					>
						<Icon name="close" size={30} />
					</TouchableHighlight>
					{error && (
						<View style={styles.error}>
							<Text>You must add friends to split the expense with!</Text>
						</View>
					)}
					{props.mode === "events" && (
						<EventModal
							form={props.form}
							setForm={props.setForm}
							handleSubmit={handleSubmit}
							onDelete={deleteItem}
							title={"Edit Event"}
						/>
					)}
					{props.mode === "toDos" && (
						<TodoModal
							form={props.form}
							setForm={props.setForm}
							handleSubmit={handleSubmit}
							onDelete={deleteItem}
							title={"Edit To Do Item"}
						/>
					)}
					{props.mode === "expenses" && (
						<ExpenseModal
							form={props.form}
							setForm={props.setForm}
							handleSubmit={handleSubmit}
							onDelete={deleteItem}
							title={"Edit Expense"}
							setFriendVisibility={props.setFriendVisibility}
							setInvited={setInvited}
							invited={invited}
							users={props.tripUsers}
						/>
					)}
					{addFriendsVisible && (
						<AddFriendsModal
							setInvited={setInvited}
							friends={props.tripUsers}
							setFriendVisibility={setFriendVisibility}
							addFriendsVisible={addFriendsVisible}
						/>
					)}
				</ImageBackground>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	close: {
		position: "absolute",
		right: 20,
		top: 20
	},
	checkBox: {
		width: "100%"
	},
	friendsContainer: {
		flex: 1,
		backgroundColor: "yellow",
		width: "90%%",
		alignItems: "center"
	},
	button: {
		borderColor: "black",
		borderBottomWidth: 2,
		width: 50,
		height: 20
	}
});

function mapStateToProps(state) {
	const { selectedTrip, gettingTripData, selectedUser } = state;
	const { events, tripUsers, expenses, toDos } = gettingTripData[
		selectedTrip
	] || {
		events: [],
		toDos: [],
		tripUsers: [],
		expenses: []
	};

	return {
		selectedTrip,
		selectedUser,
		expenses,
		events,
		tripUsers,
		toDos
	};
}

export default connect(mapStateToProps)(editModal);
