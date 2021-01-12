const IPFS = require('ipfs')
const libp2p = require('./libp2p')
const OrbitDB = require('orbit-db')

module.exports = async ({ ipfsConfig, orbitDBConfig }) => {
  const IPFSCONF = Object.assign({ libp2p }, ipfsConfig)
  const ipfs = await IPFS.create(IPFSCONF)
  const orbitDB = await OrbitDB.createInstance(ipfs)

  return { ipfs, orbitDB }
}
