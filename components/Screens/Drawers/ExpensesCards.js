import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";

export default function ExpenseCards({ items, onUpdate, user }) {
	return (
		<View style={styles.container}>
			{/* Expense => e, Index => i */}
			{items.map((e, i) => {
				return (
					<Card key={i}>
						<View style={styles.cardContainer}>
							{/* <Text>{e.transaction_id}</Text> */}
							{/* <Text>{e.paid_off}</Text> */}
							{/* e.lender_id, e.borrower_id */}
							<View style={styles.detailContainer}>
								{user == e.lender_id && (
									<View style={styles.cardTextContainer}>
										<Text style={styles.infoText}>
											{e.borrower_first_name} {e.borrower_last_name}
										</Text>
										<Text style={styles.infoText}> owes you</Text>
										<Text style={[styles.infoText, { fontWeight: "bold" }]}>
											{" "}
											${parseFloat(e.amount_owed_in_cents / 100)}
										</Text>
									</View>
								)}
								{user == e.borrower_id && (
									<View style={styles.cardTextContainer}>
										<Text style={styles.infoText}>
											You owe {e.lender_first_name} {e.lender_last_name}
											<Text style={[styles.infoText, { fontWeight: "bold" }]}>
												{" "}
												${parseFloat(e.amount_owed_in_cents / 100)}
											</Text>
										</Text>
									</View>
								)}
								<Text style={styles.infoText}>From trip: {e.trip_name}</Text>
							</View>
							{!e.paid_off && (
								<View style={styles.paidBtnContainer}>
									<TouchableOpacity
										onPress={() => {
											onUpdate(e.transaction_id);
										}}
										style={styles.paidButton}
									>
										<Text style={styles.paidBtnTxt}>Paid</Text>
									</TouchableOpacity>
								</View>
							)}
							{e.paid_off && (
								<View style={styles.alreadyPaidContainer}>
									<Text style={[styles.paidBtnTxt]}>Paid off</Text>
								</View>
							)}
						</View>
					</Card>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 0
	},
	cardTextContainer: {
		flexDirection: "row"
	},
	namesContainer: {
		flexDirection: "row"
	},
	detailContainer: {
		flex: 2,
		flexDirection: "column"
	},
	cardContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	paidBtnContainer: {
		flex: 1,
		backgroundColor: "black",
		justifyContent: "center",
		alignItems: "center"
	},
	alreadyPaidContainer: {
		flex: 1,
		backgroundColor: "green",
		justifyContent: "center",
		alignItems: "center",
		padding: 10
	},
	paidButton: {
		padding: 10
	},
	infoText: {
		fontFamily: "Avenir-Light",
		fontSize: 18
	},
	paidBtnTxt: {
		color: "white",
		fontFamily: "Avenir-Light",
		fontSize: 18
	}
});
