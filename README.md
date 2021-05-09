# goods-scalper
Check if desired item is in stock on the target websites


## Installation and usage

#### In development
###### Install docker
```bash
apt -y update
apt -y install docker.io
# add desired user to docker group
usermod -aG docker your_user
```
###### Install docker-compose
```bash
wget https://github.com/docker/compose/releases/download/1.27.4/docker-compose-Linux-x86_64
mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```
###### Clone the repo
```bash
git clone git@github.com:vt156/goods-scalper.git
cd goods-scalper
```
###### Create .env file like .env.example
###### Install dependencies
```bash
npm i
```
###### Build, lint
```bash
# Compile TypeScript to JavaScript and write the output to the ./build/ directory.
npm run build
# Watch build
npm run watch-ts
# Run ESLint.
npm run lint
```
###### Run the database and redis instance
```bash
docker-compose up db redis
```
###### Run the script
```bash
# Show help
npm run your-script -- --help
```
###### Remove containers and volumes (if you ever need that)
```bash
docker ps --filter name=ts-node-starter* -aq | xargs docker rm \
&& docker volume ls --filter name=ts-node-starter* -q | xargs docker volume rm
```