import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import TripItem from "./TripItem";

const colors = [
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"indigo",
	"lightgray"
];

export default function TripsList({ onPress, trips = [] }) {
	if (trips.length > 0) {
		return (
			<View>
				{trips.map((trip, i) => (
					<TripItem
						onPress={onPress}
						trip={trip}
						key={trip.id}
						color={colors[i]}
					/>
				))}
			</View>
		);
	} else {
		return (
			<View style={{ alignItems: "center", marginTop: "20%" }}>
				<Text>You have no trips!</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({});
