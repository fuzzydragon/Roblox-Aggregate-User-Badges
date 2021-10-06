# Roblox-Aggregate-User-Badges

If a users inventory is public then you can collect all of their badges. After collecting their badges you can get a look at the games that they play. 

There is a "flaw" in how the `collect.js` collects: _All badges with the same creator id are ignored, and just one is collected._

This means if you play 2 different games by the same person and have badges on both, you will accept the comprimise that the most recent badge's place will be collected. This is to save on bandwidth and compute time. 
* If you have proxies or lots of time, then go ahead and edit line 27. 

`node src/collect.js --id "39939779"`

`node src/aggregate.js`
