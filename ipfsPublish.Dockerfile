FROM node:14

RUN curl https://dist.ipfs.io/go-ipfs/v0.6.0/go-ipfs_v0.6.0_linux-amd64.tar.gz | tar -xz \
 && go-ipfs/install.sh && rm -r go-ipfs

WORKDIR /orbit-db

COPY package.json ./

RUN chown -R node:node /orbit-db

USER node

RUN npm install
COPY scripts/ipfs.sh /scripts/ipfs.sh
COPY src/ ./src
COPY conf/ ./conf
RUN npm run build
COPY public ./public

CMD ["/scripts/ipfs.sh"]