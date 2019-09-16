import React, { useState, useEffect } from "react";
import {
	Modal,
	View,
	Text,
	TouchableHighlight,
	Dimensions,
	ImageBackground,
	StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	postNewEvent,
	postNewTodo,
	postNewExpense
} from "../../../store/actions/tripActions";
import { connect } from "react-redux";
import getIds from "../../../helpers/getIds";
import EventModal from "./Modals/EventModal";
import TodoModal from "./Modals/TodoModal";
import ExpenseModal from "./Modals/ExpenseModal";
import AddFriendsModal from "./addFriendsModal";

/*
  Depending on the mode (event/ to_do/ expense) the form is different:
    - Event form : 
    { 
      name, 
      address, 
      starts_on, 
      ends_on, 
      description, 
      trip_id  
          }
    - Todo form : 
    { 
      content,
      boolean,
      trip_id  
          }
    - Expense form : 
    { 
      name, 
      amount_in_cents,
      expense_date, 
      trip_id 
          }
*/

function AddModal(props) {
	const [form, setForm] = useState({
		trip_id: props.tripId
	});
	const [error, setError] = useState(false);

	const handleSubmit = mode => {
		switch (mode) {
			case "event":
				props.navigation.navigate("TripEvents");
				props.dispatch(postNewEvent(form, props.selectedUser, props.tripId));
				props.setVisibility(false);
				break;
			case "to_do":
				props.navigation.navigate("TripTodo");
				props.dispatch(
					postNewTodo(
						{ ...form, completed: false },
						props.selectedUser,
						props.tripId
					)
				);
				props.setVisibility(false);
				break;
			case "expense":
				props.navigation.navigate("TripExpenses");
				props.dispatch(
					postNewExpense(
						{
							...form,
							amount_in_cents: Math.round(
								parseFloat(form.amount_in_cents) * 100
							)
						},
						props.selectedUser,
						props.tripId
					)
				);
				props.setVisibility(false);
				break;
		}
	};

	const tripUsers = props.friends.filter(user => {
		return user.id !== parseInt(props.selectedUser);
	});

	return (
		<View>
			<Modal animationType="slide" transparent={true} visible={props.isVisible}>
				<ImageBackground
					source={require("../../../assets/plant1.jpg")}
					style={{
						flex: 1,
						marginTop: "10%",
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
							props.setVisibility(false);
						}}
					>
						<Icon name="close" size={30} />
					</TouchableHighlight>

					{props.mode === "event" && (
						<EventModal
							form={form}
							setForm={setForm}
							handleSubmit={handleSubmit}
							title={"Create A New Event"}
						/>
					)}
					{props.mode === "to_do" && (
						<TodoModal
							form={form}
							setForm={setForm}
							handleSubmit={handleSubmit}
							title={"Create A New To do Item"}
						/>
					)}
					{props.mode === "expense" && (
						<ExpenseModal
							title={"Create A New Expense"}
							form={form}
							setForm={setForm}
							tripUsers={tripUsers}
							handleSubmit={handleSubmit}
						/>
					)}
				</ImageBackground>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	close: {
		position: "absolute",
		right: 20,
		top: 20,
		zIndex: 300
	}
});

export default connect()(AddModal);
