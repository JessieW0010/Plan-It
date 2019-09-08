export const SELECT_USER = "SELECT_USER";

export function selectUser(user) {
  return {
    type: SELECT_USER,
    user_id: user
  };
}

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
    trip,
    user_id
  };
}

export const ADD_NEW_USER_TRIP = "ADD_NEW_USER_TRIP";

export function addNewUserTrip(userId, trip) {
  const request = new Request(`http://localhost:5422/user/${userId}/trip`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ trip: trip })
  });
  return dispatch => {
    dispatch(requestNewUserTrip(userId, trip));
    fetch(request)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.status === "ok") {
          return dispatch(receivedNewUserTrip(userId, data.trip));
        }
      });
  };
}

export function fetchUserData(user) {
  return dispatch => {
    dispatch(requestUserData(user));
    return Promise.all([
      fetch(`http://localhost:5422/user/${user}`),
      fetch(`http://localhost:5422/user/${user}/trip`),
      fetch(`http://localhost:5422/user/${user}/transactions`),
      fetch(`http://localhost:5422/user/${user}/friend`)
    ])
      .then(response => {
        let data = response.map(res => res.json());
        return Promise.all(data);
      })
      .then(data => {
        return dispatch(receiveUserData(user, data));
      });
  };
}

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
  const request = new Request(`http://localhost:5422/user/${user}/username`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ user, newUsername })
  });
  return dispatch => {
    dispatch(requestUpdateUsername(user));
    fetch(request)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.error) {
          return dispatch(errorUpdateUsername(user, data));
        } else {
          return dispatch(receiveUpdateUsername(user, data));
        }
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
  const request = new Request(`http://localhost:5422/user/${user}/email`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ user, newEmail })
  });
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
  const request = new Request(`http://localhost:5422/user/${user}/password`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ password })
  });
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
    `http://localhost:5422/user/${user}/profile_picture`,
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
  const request = new Request(`http://localhost:5422/user/${user}/delete`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    }
  });
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
function confirmAcceptInvite(user) {
  fetch(`http://localhost:5422/user/${user}/friend`)
    .then(res => res.json())
    .then(data => {
      return {
        type: CONFIRM_ACCEPT_INVITE,
        user_id: user,
        friends: data,
        isUserUpdated: true
      };
    });
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
    `http://localhost:5422/user/${user}/friend/${friendId}`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      }
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
          return dispatch(confirmAcceptInvite(user));
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
function confirmDeclineInvite(user) {
  fetch(`http://localhost:5422/user/${user}/friend`)
    .then(res => res.json())
    .then(data => {
      return {
        type: CONFIRM_DECLINE_INVITE,
        user_id: user,
        friends: data,
        isUserUpdated: true
      };
    });
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

export function declineInvite(user, friendId) {
  const request = new Request(
    `http://localhost:5422/user/${user}/friend/${friendId}/delete`,
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
          return dispatch(confirmDeclineInvite(user));
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
  const request = new Request(`http://localhost:5422/user/${user}/friend/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ friend_id })
  });
  return dispatch => {
    dispatch(requestFriendInvite(user));
    fetch(request)
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          return dispatch(errorFriendInvite(user, data));
        } else {
          fetch(`http://localhost:5422/user/${user}/friend`)
            .then(res => res.json())
            .then(data => {
              return dispatch(confirmFriendInvite(user, data));
            });
        }
      });
  };
}
