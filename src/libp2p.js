'use strict'

const Libp2p = require('libp2p')
const WS = require('libp2p-websockets')
const WebRTCStar = require('libp2p-webrtc-star')
const Multiplex = require('libp2p-mplex')
const { NOISE } = require('libp2p-noise')
const KadDHT = require('libp2p-kad-dht')
const GossipSub = require('libp2p-gossipsub')
const ipns = require('ipns')
const uint8ArrayToString = require('uint8arrays/to-string')

const ipnsUtils = {
  encodeBase32: (buf) => uint8ArrayToString(buf, 'base32upper'),
  validator: {
    func: (key, record, cb) => ipns.validator.validate(record, key, cb)
  },
  selector: (_k, records) => ipns.validator.select(records[0], records[1])
}

module.exports = (opts) => {
  console.debug({ opts })
  const { peerId, libp2pOptions, options } = opts
  console.debug({ 'addresses.listen': libp2pOptions.addresses.listen.map(a => a.toString()) })

  return new Libp2p(Object.assign({
    modules: {
      transport: [
        WS,
        WebRTCStar
      ],
      streamMuxer: [
        Multiplex
      ],
      connEncryption: [
        NOISE
      ],
      peerDiscovery: [],
      dht: KadDHT,
      pubsub: GossipSub
    },
    config: {
      peerDiscovery: {
        autoDial: true,
        // [Bootstrap.tag] = 'bootstrap'
        bootstrap: {
          enabled: true
        },
        // [WebRTCStar.discovery.tag]
        webRTCStar: {
          enabled: true
        }
      },
      dht: {
        kBucketSize: 20,
        enabled: false,
        clientMode: true,
        randomWalk: {
          enabled: false
        },
        validators: {
          ipns: ipnsUtils.validator
        },
        selectors: {
          ipns: ipnsUtils.selector
        }
      },
      pubsub: {
        enabled: true,
        emitSelf: true
      }
    },
    metrics: {
      enabled: true
    },
    peerStore: {
      persistence: true,
      threshold: 1
    }
  },
  { ...libp2pOptions },
  {
    peerId,
    addresses: {
      listen: options.Addresses.Swarm
    },
    dialer: {
      maxParallelDials: 150, // 150 total parallel multiaddr dials
      maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
      dialTimeout: 600e3 // 600 second dial timeout per peer dial
    }
  }
  ))
}
