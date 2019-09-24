// **********************************************************************************||
// 				userAction file holds all actions related to users that are			 ||
// 								dispatched to the store								 ||
// **********************************************************************************||
// 				The constant strings such as SELECT_USER are exported to the		 ||
// 				userReducer and functions such as selectUser are exported to		 ||
// 				screens that can perform those actions. Eg. selectUser in the		 ||
// 				Login and SignUp screen.											 ||
// 																					 ||
// **********************************************************************************||



// ----------------------------------------------------------------------------------
// 		SELECT_USER => sets the selectedUser in the store, used on login/signup
// ----------------------------------------------------------------------------------

export const SELECT_USER = "SELECT_USER";

export function selectUser(user) {
	return {
		type: SELECT_USER,
		user_id: user
	};
}

// ----------------------------------------------------------------------------------
// 		REQUEST_USER_DATA, RECEIVE_USER_DATA, ERROR_USER_DATA
// 		=> creates a get request to fetch user details, trips, 
//			expenses and friends
// ----------------------------------------------------------------------------------

export const REQUEST_USER_DATA = "REQUEST_USER_DATA";

function requestUserData(user) {
	return {
		type: REQUEST_USER_DATA,
		user_id: user,
		isFetchingUser: true
	};
}

export const RECEIVE_USER_DATA = "RECEIVE_USER_DATA";

function receiveUserData(user, data) {
	return {
		type: RECEIVE_USER_DATA,
		isFetchingUser: false,
		user_id: user,
		user: {
			first_name: data[0].first_name,
			last_name: data[0].last_name,
			email: data[0].email,
			username: data[0].username,
			profile_picture: data[0].profile_picture
		},
		user_trips: data[1],
		user_expenses: data[2],
		user_friends: data[3]
	};
}

export const ERROR_USER_DATA = "ERROR_USER_DATA";

function errorUserData(user, error) {
	return {
		type: ERROR_USER_DATA,
		user_id: user,
		isFetchingUser:  {
			error: "Fetching user failed",
			error_message: error
		}
	};
}

export function fetchUserData(user) {
	return dispatch => {
		dispatch(requestUserData(user));
		return Promise.all([
			fetch(`https://plan-it-api-1.herokuapp.com/user/${user}`),
			fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/trip`),
			fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/transactions`),
			fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/friend`)
		])
			.then(response => {
				let data = response.map(res => res.json());
				return Promise.all(data);
			})
			.then(data => {
					return dispatch(receiveUserData(user, data));
			})
			.catch(error => {
				console.log("Fetching user data failed >>> ", error)
				return dispatch(errorUserData(user, "Fetching user data failed"));
			});
	};
}

// ----------------------------------------------------------------------------------
// 		REQUEST_NEW_USER_TRIP, RECEIVED_NEW_USER_TRIP, ERROR_NEW_USER_TRIP
// 		=> creates a post request to create a new trip for a user
// ----------------------------------------------------------------------------------

export const REQUEST_NEW_USER_TRIP = "REQUEST_NEW_USER_TRIP";

function requestNewUserTrip(user_id, trip) {
	return {
		type: REQUEST_NEW_USER_TRIP,
		isUserUpdated: false,
		user_id
	};
}

export const RECEIVED_NEW_USER_TRIP = "RECEIVED_NEW_USER_TRIP";

function receivedNewUserTrip(user_id, trip) {
	return {
		type: RECEIVED_NEW_USER_TRIP,
		isUserUpdated : true,
		trip,
		user_id
	};
}

export const ERROR_NEW_USER_TRIP = "ERROR_NEW_USER_TRIP";

function errorNewUserTrip(user_id) {
	return {
		type: ERROR_USER_DATA,
		user_id,
		isFetchingUser:  {
			error: "Creating new trip failed"
			// any other error info can go in here
		}
	};
}

export function addNewUserTrip(userId, trip) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${userId}/trip`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			// changed below from { trip: trip }
			body: JSON.stringify({ trip })
		}
	);
	return dispatch => {
		dispatch(requestNewUserTrip(userId, trip));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.status === "ok") {
					return dispatch(receivedNewUserTrip(userId, data.trip));
				} else {
					console.log("Creating new trip for user failed >>>",data.message)
					return dispatch(errorNewUserTrip(userId))
				}
			})
			.catch(error => {
				console.log("Creating new trip, failed promise >>>", error)
				return dispatch(errorNewUserTrip(userId))
			});
	};
}

// ----------------------------------------------------------------------------------
// 		REQUEST_UPDATE_USERNAME, RECEIVE_UPDATE_USERNAME, ERROR_UPDATE_USERNAME
// 		=> creates a post request to update user's username
// ----------------------------------------------------------------------------------

export const REQUEST_UPDATE_USERNAME = "REQUEST_UPDATE_USERNAME";

function requestUpdateUsername(user) {
	return {
		type: REQUEST_UPDATE_USERNAME,
		user_id: user,
		isUserUpdated: false
	};
}

export const RECEIVE_UPDATE_USERNAME = "RECEIVE_UPDATE_USERNAME";

function receiveUpdateUsername(user, data) {
	return {
		type: RECEIVE_UPDATE_USERNAME,
		user_id: user,
		newUsername: data.newUsername,
		isUserUpdated: true
	};
}

export const ERROR_UPDATE_USERNAME = "ERROR_UPDATE_USERNAME";

function errorUpdateUsername(user, data) {
	return {
		type: ERROR_UPDATE_USERNAME,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}

export function changeUsername(user, newUsername) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/username`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ user, newUsername })
		}
	);
	return dispatch => {
		dispatch(requestUpdateUsername(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					console.log("Error updating username >>>", data.error_message)
					return dispatch(errorUpdateUsername(user, data));
				} else {
					return dispatch(receiveUpdateUsername(user, data));
				}
			})
			.catch(error => {
				console.log("Promise error, updating username >>>", error)
				return dispatch(errorUpdateUsername(user, {error: "Update failed", error_message: "Saving new username failed"}))
			});
	};
}

export const REQUEST_UPDATE_EMAIL = "REQUEST_UPDATE_EMAIL";

function requestUpdateEmail(user) {
	return {
		type: REQUEST_UPDATE_EMAIL,
		user_id: user,
		isUserUpdated: false
	};
}

export const RECEIVE_UPDATE_EMAIL = "RECEIVE_UPDATE_EMAIL";

function receiveUpdateEmail(user, data) {
	return {
		type: RECEIVE_UPDATE_EMAIL,
		user_id: user,
		newEmail: data.newEmail,
		isUserUpdated: true
	};
}

export const ERROR_UPDATE_EMAIL = "ERROR_UPDATE_EMAIL";

function errorUpdateEmail(user, data) {
	return {
		type: ERROR_UPDATE_EMAIL,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}

export function changeEmail(user, newEmail) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/email`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ user, newEmail })
		}
	);
	return dispatch => {
		dispatch(requestUpdateEmail(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorUpdateEmail(user, data));
				} else {
					return dispatch(receiveUpdateEmail(user, data));
				}
			});
	};
}

export const REQUEST_UPDATE_PASSWORD = "REQUEST_UPDATE_PASSWORD";

function requestUpdatePassword(user) {
	return {
		type: REQUEST_UPDATE_PASSWORD,
		user_id: user,
		isUserUpdated: false
	};
}

export const RECEIVE_UPDATE_PASSWORD = "RECEIVE_UPDATE_PASSWORD";

function receiveUpdatePassword(user, data) {
	return {
		type: RECEIVE_UPDATE_PASSWORD,
		user_id: user,
		isUserUpdated: {
			success: data.success
		}
	};
}

export const ERROR_UPDATE_PASSWORD = "ERROR_UPDATE_PASSWORD";

function errorUpdatePassword(user, data) {
	return {
		type: ERROR_UPDATE_PASSWORD,
		user_id: user,
		isUserUpdated: {
			success: data.success,
			error: data.error,
			error_message: data.error_message
		}
	};
}
// password = { currentPassword, newPassword }
export function changePassword(user, password) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/password`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ password })
		}
	);
	return dispatch => {
		dispatch(requestUpdatePassword(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorUpdatePassword(user, data));
				} else {
					return dispatch(receiveUpdatePassword(user, data));
				}
			});
	};
}

export const REQUEST_UPDATE_PROFILEPIC = "REQUEST_UPDATE_PROFILEPIC";
function requestUpdateProfilePic(user) {
	return {
		type: REQUEST_UPDATE_PROFILEPIC,
		user_id: user,
		isUserUpdated: false
	};
}
export const RECEIVE_UPDATE_PROFILEPIC = "RECEIVE_UPDATE_PROFILEPIC";
function receiveUpdateProfilePic(user, data) {
	return {
		type: RECEIVE_UPDATE_PROFILEPIC,
		user_id: user,
		newProfilePic: data.newProfilePicture,
		isUserUpdated: true
	};
}
export const ERROR_UPDATE_PROFILEPIC = "ERROR_UPDATE_PROFILEPIC";
function errorUpdateProfilePic(user, data) {
	return {
		type: ERROR_UPDATE_PROFILEPIC,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}
export function changeProfilePic(user, newProfilePicture) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/profile_picture`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ newProfilePicture })
		}
	);
	return dispatch => {
		dispatch(requestUpdateProfilePic(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorUpdateProfilePic(user, data));
				} else {
					return dispatch(receiveUpdateProfilePic(user, data));
				}
			});
	};
}
export const REQUEST_DELETE_ACCOUNT = "REQUEST_DELETE_ACCOUNT";
function requestDeleteAccount(user) {
	return {
		type: REQUEST_DELETE_ACCOUNT,
		user_id: user,
		isUserUpdated: false
	};
}
export const CONFIRM_DELETE_ACCOUNT = "CONFIRM_DELETE_ACCOUNT";
function confirmDeleteAccount(user, data) {
	return {
		type: CONFIRM_DELETE_ACCOUNT,
		user_id: user,
		isUserUpdated: true
	};
}
export const ERROR_DELETE_ACCOUNT = "ERROR_DELETE_ACCOUNT";
function errorDeleteAccount(user, data) {
	return {
		type: ERROR_DELETE_ACCOUNT,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}
export function deleteAccount(user) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/delete`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			}
		}
	);
	return dispatch => {
		dispatch(requestDeleteAccount(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorDeleteAccount(user, data));
				} else {
					return dispatch(confirmDeleteAccount(user, data));
				}
			});
	};
}

export const REQUEST_ACCEPT_INVITE = "REQUEST_ACCEPT_INVITE";
function requestAcceptInvite(user) {
	return {
		type: REQUEST_ACCEPT_INVITE,
		user_id: user,
		isUserUpdated: false
	};
}
export const CONFIRM_ACCEPT_INVITE = "CONFIRM_ACCEPT_INVITE";
function confirmAcceptInvite(user, data) {
	return {
		type: CONFIRM_ACCEPT_INVITE,
		user_id: user,
		friends: data,
		isUserUpdated: true
	};
}
export const ERROR_ACCEPT_INVITE = "ERROR_ACCEPT_INVITE";
function errorAcceptInvite(user, data) {
	return {
		type: ERROR_ACCEPT_INVITE,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}

export function acceptInvite(user, friendId) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/friend/${friendId}`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			}
			//   body: JSON.stringify({})
		}
	);
	return dispatch => {
		dispatch(requestAcceptInvite(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorAcceptInvite(user, data));
				} else {
					fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/friend`)
						.then(res => res.json())
						.then(data => {
							return dispatch(confirmAcceptInvite(user, data));
						});
				}
			});
	};
}

export const REQUEST_DECLINE_INVITE = "REQUEST_DECLINE_INVITE";
function requestDeclineInvite(user) {
	return {
		type: REQUEST_DECLINE_INVITE,
		user_id: user,
		isUserUpdated: false
	};
}
export const CONFIRM_DECLINE_INVITE = "CONFIRM_DECLINE_INVITE";
function confirmDeclineInvite(user, data) {
	return {
		type: CONFIRM_DECLINE_INVITE,
		user_id: user,
		friends: data,
		isUserUpdated: true
	};
}
export const ERROR_DECLINE_INVITE = "ERROR_DECLINE_INVITE";
function errorDeclineInvite(user, data) {
	return {
		type: ERROR_DECLINE_INVITE,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}

// DECLINE IS USED FOR DELETING FRIENDS AS WELL
export function declineInvite(user, friendId) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/friend/${friendId}/delete`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			}
		}
	);
	return dispatch => {
		dispatch(requestDeclineInvite(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorDeclineInvite(user, data));
				} else {
					fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/friend`)
						.then(res => res.json())
						.then(data => {
							return dispatch(confirmDeclineInvite(user, data));
						});
				}
			});
	};
}

export const REQUEST_FRIEND_INVITE = "REQUEST_FRIEND_INVITE";
function requestFriendInvite(user) {
	return {
		type: REQUEST_FRIEND_INVITE,
		user_id: user,
		isUserUpdated: false
	};
}
export const CONFIRM_FRIEND_INVITE = "CONFIRM_FRIEND_INVITE";
function confirmFriendInvite(user, data) {
	return {
		type: CONFIRM_FRIEND_INVITE,
		user_id: user,
		friends: data,
		isUserUpdated: true
	};
}
export const ERROR_FRIEND_INVITE = "ERROR_FRIEND_INVITE";
function errorFriendInvite(user, data) {
	return {
		type: ERROR_FRIEND_INVITE,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}

export function sendFriendRequest(user, friend_id) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/friend/`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ friend_id })
		}
	);
	return dispatch => {
		dispatch(requestFriendInvite(user));
		fetch(request)
			.then(response => response.json())
			.then(data => {
				if (!data.success) {
					return dispatch(errorFriendInvite(user, data));
				} else {
					fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/friend`)
						.then(res => res.json())
						.then(data => {
							return dispatch(confirmFriendInvite(user, data));
						});
				}
			});
	};
}

// NOT IN USER REDUCER, IN TRIP REDUCER INSTEAD TO SHOW LOADING SCREEN IF NEEDED
export const REQUEST_TRIP_INFO_UPDATE = "REQUEST_TRIP_INFO_UPDATE";
function requestTripInfoUpdate(current_trip) {
	return {
		type: REQUEST_TRIP_INFO_UPDATE,
		isTripUpdated: false,
		current_trip
	};
}

// NOT IN USER REDUCER, IN TRIP REDUCER INSTEAD TO SHOW LOADING SCREEN IF NEEDED
export const RECEIVE_TRIP_INFO_FOR_TRIP = "RECEIVE_TRIP_INFO_FOR_TRIP";
function receiveTripInfoUpdateForTrips(current_trip, users) {
	return {
		type: RECEIVE_TRIP_INFO_FOR_TRIP,
		isTripUpdated: true,
		current_trip,
		users
	};
}

export const RECEIVE_TRIP_INFO_UPDATE = "RECEIVE_TRIP_INFO_UPDATE";
function receivedTripInfoUpdate(user_id, trips) {
	return {
		type: RECEIVE_TRIP_INFO_UPDATE,
		trips,
		user_id
	};
}

// TRIP => updateInfo => {
//            name,
//            location,
//            starts_on,
//            ends_on,
//            description,
//            added:[user_ids],
//            removed:[user_ids] } id is already in params
export function updateTrip(userId, tripId, updateInfo) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${userId}/trip/${tripId}`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ ...updateInfo })
		}
	);

	return dispatch => {
		dispatch(requestTripInfoUpdate(tripId));
		fetch(request)
			.then(response => response.json())
			.then(data => {
				if (data.status == "ok") {
					fetch(`https://plan-it-api-1.herokuapp.com/user/${userId}/trip`)
						.then(res => res.json())
						.then(json => {
							dispatch(receivedTripInfoUpdate(userId, json));
						});
					fetch(
						`https://plan-it-api-1.herokuapp.com/user/${userId}/trip/${tripId}/users`
					)
						.then(res => res.json())
						.then(json => {
							dispatch(receiveTripInfoUpdateForTrips(tripId, json));
						});
				} else {
					// handle error
					console.log(json.status, json.error_message);
				}
			});
	};
}

// NOT IN USER REDUCER, IN TRIP REDUCER INSTEAD TO SHOW LOADING SCREEN IF NEEDED
export const REQUEST_TRIP_DELETE = "REQUEST_TRIP_DELETE";
function requestTripDelete(current_trip) {
	return {
		type: REQUEST_TRIP_DELETE,
		isTripUpdated: false,
		current_trip
	};
}

// NOT IN USER REDUCER, IN TRIP REDUCER INSTEAD TO SHOW LOADING SCREEN IF NEEDED
export const RECEIVE_TRIP_DELETE_FOR_TRIP = "RECEIVE_TRIP_DELETE_FOR_TRIP";
function receiveTripDeleteForTrips(current_trip) {
	return {
		type: RECEIVE_TRIP_DELETE_FOR_TRIP,
		isTripUpdated: true,
		current_trip
	};
}

export const RECEIVE_TRIP_DELETE = "RECEIVE_TRIP_DELETE";
function receivedTripDelete(user_id, trips) {
	return {
		type: RECEIVE_TRIP_DELETE,
		user_id,
		trips
	};
}

export function deleteTrip(userId, tripId) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${userId}/trip/${tripId}/delete`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			}
		}
	);

	return dispatch => {
		dispatch(requestTripDelete(tripId));
		fetch(request)
			.then(response => response.json())
			.then(data => {
				// USE FOR TRIP_USERS?
				dispatch(receiveTripDeleteForTrips(tripId));
				if (data.status == "ok") {
					fetch(`https://plan-it-api-1.herokuapp.com/user/${userId}/trip`)
						.then(res => res.json())
						.then(json => {
							return dispatch(receivedTripDelete(userId, json));
						});
				} else {
					// handle error
					console.log(json.status, json.error_message);
				}
			});
	};
}


export const REQUEST_UPDATE_TRANSACTION = "REQUEST_UPDATE_TRANSACTION";
function requestUpdateTransaction(user) {
	return {
		type: REQUEST_UPDATE_TRANSACTION,
		user_id: user,
		isUserUpdated: false
	};
}
export const RECEIVE_UPDATE_TRANSACTION = "RECEIVE_UPDATE_TRANSACTION";
function receiveUpdateTransaction(user, data) {
	return {
		type: RECEIVE_UPDATE_TRANSACTION,
		user_id: user,
		user_expenses: data,
		isUserUpdated: true
	};
}
export const ERROR_UPDATE_TRANSACTION = "ERROR_UPDATE_TRANSACTION";
function errorUpdateTransaction(user, data) {
	return {
		type: ERROR_UPDATE_TRANSACTION,
		user_id: user,
		isUserUpdated: {
			error: data.error,
			error_message: data.error_message
		}
	};
}
// /user/:user_id/transaction/:id/
export function updateTransaction(user, transactionId) {
	const request = new Request(
		`https://plan-it-api-1.herokuapp.com/user/${user}/transaction/${transactionId}/`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json"
			}
		}
	);
	return dispatch => {
		dispatch(requestUpdateTransaction(user));
		fetch(request)
			.then(response => {
				return response.json();
			})
			.then(data => {
				if (data.error) {
					return dispatch(errorUpdateTransaction(user, data));
				} else {
					fetch(`https://plan-it-api-1.herokuapp.com/user/${user}/transactions`)
						.then(res => res.json())
						.then(data => {
							return dispatch(receiveUpdateTransaction(user, data));
						});
				}
			});
	};
}