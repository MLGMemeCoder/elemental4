pm2 stop elemental4

git pull
npm i -D
npm run build-game
npm run build-server

pm2 start elemental4
pm2 save
