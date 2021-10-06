const fs = require(`fs/promises`)

const https = require(`./modules/https/index.js`),
	cli = require(`./modules/cli/index.js`),
	roblox = require(`./modules/roblox/index.js`)

const flags = cli.flags()

async function generate(user, id) {
	console.log(user, id)

	let page = 1
	let cursor = ""

	const used = {}
	const badges = []

	while (cursor !== null) {
		const response = await https.get(`https://www.roblox.com/users/inventory/list-json?assetTypeId=21&itemsPerPage=100&pageNumber=${page}&userId=${id}&cursor=${cursor}`)
		
		if (response.status === 200) {
			const { Data: { nextPageCursor, Items } } = JSON.parse(response.body)

			console.log(page, cursor)
			
			for (const { Item: { AssetId }, Creator: { Id, Type } } of Items) {
				if (used[Id] === undefined) {
					console.log(AssetId, Id, Type)
					used[Id] = true
					badges.push({ AssetId, Id, Type })
				}
			}

			cursor = nextPageCursor
			page += 1
		}
	}

	fs.writeFile(`./Badges_${id}.json`, JSON.stringify(badges, null, `\t`))
		.then(() => console.log(`Wrote ./Badges_${id}.json`))
}

const user = flags[`--user`],
	id = flags[`--id`]

if (user != undefined) {
	roblox
		.fetchIdForUsername(user)
		.then(id => generate(user, id))
} else if (id != undefined) {
	roblox
		.fetchUsernameForId(id)
		.then(user => generate(user, id))
}
