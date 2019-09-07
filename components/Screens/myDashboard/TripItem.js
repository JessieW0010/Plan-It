import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

export default function TripItem({ onPress, trip }) {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => {
					onPress(trip.id);
				}}
				style={styles.tripContentItem}
			>
				<Text style={styles.tripNameText}>{trip.name}</Text>

				<Text style={styles.tripLocationText}>{trip.location}</Text>

				<Text style={styles.dateText}>{trip.starts_on}</Text>

				<Text style={styles.dateText}>{trip.ends_on}</Text>

				<Text style={styles.tripDescText}>{trip.description}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	},
	tripContentItem: {
		backgroundColor: "#D3D3D3",
		height: 150,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 5
	},
	tripNameText: {
		fontSize: 20,
		color: "yellow"
	},
	tripLocationText: {
		fontSize: 12,
		color: "lightgreen"
	}
});
