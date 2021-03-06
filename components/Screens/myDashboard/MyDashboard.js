import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Image
} from "react-native";
import CalendarMonth from "./CalendarMonth";
import TripsList from "./TripsList";
import MenuBtn from "../../Buttons/Menubtn";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { selectTrip, fetchTripData } from "../../../store/actions/tripActions";
import { gettingUserData } from "../../../store/reducers/userReducer";

function Dashboard(props) {
	const onPressTripHandler = trip_id => {
		props.dispatch(selectTrip(trip_id));
		props.dispatch(fetchTripData(trip_id, props.selectedUser));
		props.navigation.navigate("TabNavigator");
	};

	return (
		<View style={styles.mainScreenContainer}>
			<MenuBtn navigation={props.navigation} />
			<View style={styles.topContainer}>
				<View style={styles.calendarContainer}>
					<CalendarMonth trips={props.user_trips} />
				</View>
			</View>

			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={{
						height: 40,
						backgroundColor: "black",
						alignItems: "center",
						justifyContent: "center",
						width: "90%",
						marginLeft: "5%"
					}}
					onPress={() => props.navigation.navigate("NewTrip")}
				>
					<Text
						style={{
							color: "#FFFFFF",
							fontFamily: "Avenir",
							fontSize: 15
						}}
					>
						+ Add new trip
					</Text>
				</TouchableOpacity>
				<ScrollView
					style={styles.tripsScrollContainer}
					contentContainerStyle={styles.tripsContent}
				>
					{!props.isFetchingUser && (
						<TripsList onPress={onPressTripHandler} trips={props.user_trips} />
					)}
					{props.isFetchingUser && (
						<View>
							<Image
								source={require("../../../assets/loading.gif")}
								style={styles.loading}
							/>
							<Text style={styles.loadingText}>
								Your data is being loaded...
							</Text>
						</View>
					)}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainScreenContainer: {
		flex: 1,
		height: Dimensions.get("screen").width
	},
	topContainer: {
		flex: 1,
		marginTop: "5%",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	},
	bottomContainer: {
		flex: 1.6,
		flexDirection: "column",
		justifyContent: "center",
		width: "100%"
	},
	calendarContainer: {
		marginTop: "2%"
	},
	tripsScrollContainer: {
		width: "100%"
	},
	tripsContent: {
		paddingBottom: 10
	},
	loading: {
		alignSelf: "center",
		marginTop: 50
	},
	loadingText: {
		textAlign: "center",
		marginTop: 20
	}
});

function mapStateToProps(state) {
	const {
		/* selectedTrip, gettingTripData, */ selectedUser,
		gettingUserData
	} = state;
	// const { isFetchingTrip, events, toDos, expenses } = gettingTripData[
	// 	selectedTrip
	// ] || {
	// 	isFetchingTrip: true,
	// 	events: [],
	// 	toDos: [],
	// 	expenses: []
	// };

	const { isFetchingUser, user_trips } = gettingUserData[selectedUser] || {
		isFetchingUser: false,
		user_trips: []
	};

	return {
		// selectedTrip,
		// isFetchingTrip,
		// events,
		// toDos,
		// expenses
		selectedUser,
		isFetchingUser,
		user_trips
	};
}

export default connect(mapStateToProps)(Dashboard);
