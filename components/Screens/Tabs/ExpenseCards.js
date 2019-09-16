import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";

export default function ExpenseCards({ items, onPress, userId, tripUsers }) {
	return (
		<View style={styles.mainContainer}>
			{items.map((e, i) => {
				return (
					<View key={e.id} style={styles.cards}>
						<View style={{ margin: "5%" }}>
							<View style={styles.expenseInfo}>
								<Text style={styles.title}>{e.name}</Text>
								<Text style={{ fontSize: 10 }}>{e.expense_date}</Text>
								{userId == e.lender_id ? (
									<Text style={styles.text}>
										You lent ${e.amount_in_cents / 100} dollars
									</Text>
								) : (
									<Text style={styles.text}>
										User {e.lender} lent ${e.amount_in_cents / 100} dollars
									</Text>
								)}
							</View>
							<View style={styles.userInfo}>
								{userId == e.lender ? (
									<Text>You are owed by {e.borrowers.length} people</Text>
								) : (
									<Text>
										You owe ${e.amount_in_cents / 100 / e.borrowers.length}{" "}
										dollars
									</Text>
								)}
							</View>
						</View>
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: "center",
		width: "100%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.5,
		shadowRadius: 3.84
	},
	cards: {
		height: 100,
		width: "90%",
		justifyContent: "center",
		backgroundColor: "white",
		marginBottom: "2%",
		paddingBottom: "2%"
	},
	title: {
		fontFamily: "Avenir",
		fontSize: 18,
		color: "black"
	},
	text: { fontFamily: "Avenir", fontSize: 15, color: "black" }
});
