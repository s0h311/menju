# Upgrade Node, npm and yarn

## Upgrade Node to 18.18.2

```bash
nvm install 18.18.2
nvm use 18.18.2
nvm uninstall 18.16.1

node --version
```

## Upgrade npm to 10.2.3

```bash
nvm use 18.18.2
npm install -g npm@10.2.3

npm --version
```

### Install dotenv globally

```bash
npm install -g dotenv-cli
```

## Upgrade yarn to 4.0.2

```bash
yarn set version stable

yarn --version

rm -fr node_modules
rm yarn.lock
yarn install
```
