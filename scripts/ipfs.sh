#! /bin/sh
ipfs --api=/dns4/ipfs/tcp/5001 add --recursive --wrap-with-directory --chunker=rabin --cid-version=1 dist public