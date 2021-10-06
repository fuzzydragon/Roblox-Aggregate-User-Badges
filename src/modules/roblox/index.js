const https = require(`../https/index.js`)

async function fetchIdForUsername(name) {
	return https.get(`https://api.roblox.com/users/get-by-username?username=${name}`)
		.then(response => JSON.parse(response.body).Id)
}

async function fetchFriendsForUserId(id) {
	return https.get(`https://friends.roblox.com/v1/users/${id}/friends`)
		.then(response => JSON.parse(response.body).data)
}

async function fetchUsernameForId(id) {
	return https.get(`https://users.roblox.com/v1/users/${id}`)
		.then(response => JSON.parse(response.body).name)
}

module.exports = { fetchIdForUsername, fetchFriendsForUserId, fetchUsernameForId }