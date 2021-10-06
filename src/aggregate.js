const { readFile } = require("fs")
const fs = require(`fs/promises`)

const https = require(`./modules/https/index.js`),
	cli = require(`./modules/cli/index.js`)

const flags = cli.flags()

const sleep = ms => new Promise(r => setTimeout(r, ms))

// maybe i should package this inside roblox module..? (but its not actually how roblox does it...so maybe not.)
// this is just a "patch" 
function robloxURLEncode(name) {
	return name
		.replace(/[^A-Za-z 0-9]*/g, "")
		.replace(/\s/g, `-`)
		.replace(/\-\-/g, `-`)
}

async function aggregate(user, data, cache) {
	const places = { raw: [], urls: []}

	for (const { AssetId, Id, Type } of data ) {
		let response = cache[AssetId] || await https.get(`https://badges.roblox.com/v1/badges/${AssetId}`)

		while (response.status !== 200) {
			console.log(`WEB ERROR: ${response.status}!`)
			await sleep(60000)
			response = await https.get(`https://badges.roblox.com/v1/badges/${AssetId}`)
		}

		cache[AssetId] = response
		
		const badge = JSON.parse(response.body)

		if (badge) {
			const awardingUniverse = badge.awardingUniverse

			if (awardingUniverse) {
				const { name, rootPlaceId } = awardingUniverse

				console.log(AssetId, rootPlaceId)
				places.raw.push({ AssetId, name, rootPlaceId })
				places.urls.push(`https://www.roblox.com/games/${rootPlaceId}/${robloxURLEncode(name)}`)
			} else {
				console.log(`MISSING AWARDING UNIVERSE: ${AssetId, Id, Type} ???`)
			}
		} else {
			console.log(`MISSING BADGE: ${AssetId, Id, Type} ???`)
		}
	}

	fs.writeFile(`./Places_${user}.json`, JSON.stringify(places, null, `\t`))
		.then(() => console.log(`Wrote ./Places_${user}.json`))
	
	fs.writeFile(`./BadgeCache.json`, JSON.stringify(cache, null, `\t`))
}

let cache
const { [`--id`]: id } = flags

fs.readFile(`./BadgesCache.json`)
	.then(buff => cache = JSON.parse(buff))
	.catch(() => cache = {}) // :trollface:
	.then(() => fs.readFile(`./Badges_${id}.json`) )
	.then(buff => aggregate(id, JSON.parse(buff), cache))
