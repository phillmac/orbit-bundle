
'use strict'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchConf = () => Promise.all(['./conf/ipfs.json', './conf/orbitDB.json', './conf/app.json'].map(p => fetch(p).then(resp => resp.json())))

const createInstances = ({ ipfsConfig, orbitDBConfig }) => OrbitDBBundle({
  ipfsConfig,
  orbitDBConfig
})

screenLog.init()
fetchConf()
  .then(([{ ipfsConfig }, { orbitDBConfig }, { appConfig }]) => {
    createInstances({ ipfsConfig, orbitDBConfig })
      .then(({
        ipfs,
        orbitDB
      }) => {
        const peersList = new Set()
        function checkPeers () {
          sleep(5000)
            .then(() => ipfs.swarm.peers())
            .then(peers => {
              peers.forEach(p => peersList.add(p.addr.toString()))
            })
            .then(() => {
              const pLength = [...peersList].length
              console.info(`Waiting for peers. found: ${pLength}`)
              if (pLength <= 5) {
                checkPeers()
              } else {
                peersList.forEach(p => console.info(p))
                Promise.all(appConfig.peers.map(p => ipfs.swarm.connect(p, { timeout: 300000 })
                  .then(result => console.info({
                    p, result
                  }))
                  .catch(err => console.error({
                    p, err
                  }))
                ))
                  .then(console.info('Finished connecting peers'))
              }
            })
        }
        checkPeers()
      })
  }).catch(err => console.error({ err }))
