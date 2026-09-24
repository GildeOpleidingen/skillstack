# CodeFolio

Code rating etc..
Started as an idea to do competitive coding and learning nice way
Also I wanted a challenge to write a backend in c++ (and maybe later c only)


THIS DOCUMENT IS A WORK IN PROGRESS!!!

## Build dependencies

```bash
  sudo apt install nodejs sqlite3  pkg-config libcap-dev build-essential nginx nlohmann-json3-dev sqlite3-tools libsqlite3-dev libfcgi-dev libcurl4-openssl-dev
```





## SSL

```dash
sudo certbot --nginx -d codefolio.gildedevops.it
```

## Login will be done via oauth with GitHub.

Client ID
Ov23lih4HBLkEVAmqhOm

Client secrets
b87b49339a9408ab130b4c75e61b4fec15cf874c

https://github.com/settings/profile

Goto: <> Developer settings

For Development:
Client ID
Ov23lipfbFJQzLspBO3t

Client Secret
49ea74cc540528a1528f476a798a1403bdba861e

Set them in config.env (see config.env.default)
CLIENT_ID=Ov23lipfbFJQzLspBO3t
CLIENT_SECRET=b87b49339a9408ab130b4c75e61b4fec15cf874c
CLIENT_REDIRECT_URL=http://localhost/auth/github/callback

Production:

CLIENT_ID=Ov23lih4HBLkEVAmqhOm
CLIENT_SECRET=b87b49339a9408ab130b4c75e61b4fec15cf874c
CLIENT_REDIRECT_URL=https://codefolio.gildedevops.it/auth/github/callback

## Compile

### Dependencies

g++, sqlite3 and curl and nlohmann for json

```bash
sudo apt install nlohmann-json3-dev
```
<!-- 
```bash
g++ src/github_login.cpp -o github_login.cgi -lcurl -lsqlite3
```

```bash
g++ -std=c++17 -o github_login.cgi src/main.cpp src/db.cpp src/session.cpp src/github_login.cpp src/utils.cpp -lsqlite3 -lcurl
``` -->

To build:
```bash
make
```


## Code structure
```
rateit/
├── cgi-bin/                # final binaries copied here
│   └── api.cgi
├── api/
│   ├── exerise.cpp
|   └── ... 
│   api/include/                # shared headers
│   ├── db.h
│   ├── session.h
│   ├── github_login.h
│   └── utils.h
├── src/                    # Javascript source
    NOW USING subfolders/components!!!
│   ├── categories.js
│   ├── dashboard.js
│   ├── main.js
|   ...
│   └── utils.js
└── Makefile
```
## DATABASE

> Using sqlite3 

```bash
npm run migrations
```

## NGINX

> See nginx_config ./nginx_config.example


## Code review

> Using Isolate for doing the compiling

```bash
sudo apt install pkg-config libcap-dev build-essential git
sudo apt install libsystemd-dev
sudo apt install asciidoc
git clone https://github.com/ioi/isolate.git
cd isolate
make    
make install       <---- ??
```

### Switching to docker

> See Dockerfile_cpp_sandbox and Dockerfile_node_sandbox

Dockerfile
```bash
FROM node:20-alpine
WORKDIR /app
# Optional: create a non-root user for extra safety
RUN adduser -D sandbox
USER sandbox
```
> docker build -t node-sandbox .

> On Gentoo

```bash
emerge --ask --verbose app-containers/docker app-containers/docker-cli
```

> On Ubuntu

```bash
sudo apt-get update
sudo apt-get install docker.io -y


sudo systemctl enable docker
sudo systemctl start docker


sudo usermod -aG docker $USER

```

### Systemd service

For production we make a service, for development just run graderd.

sudo vim /etc/systemd/system/graderd.service

```
[Unit]
Description=CodeTrainer Grading Daemon
After=network.target

[Service]
ExecStart=/home/rayit/rateit/graderd
Restart=always
User=rayit
WorkingDirectory=/home/rayit/rateit
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

To view logs:
```bash
journalctl -u graderd.service -f
```
## Test

```c++
#include <iostream>

int main() {
  int x, y;
  std::cin >> x >> y;
  std::cout << x + y;
  return 0;
}
```

## Version UPDATE

To update version run:
./version.sh

## Isolate

// For nodejs
sudo apt install expect

> Had to change rights of the folder

> BETTER is to use this command as the user the graderd daemon will run
```bash 
isolate --box-id=0 --init
```

## Looking into fastcgi
```
sudo apt install libfcgi-dev
```

server {
...
    location /test {
        include fastcgi_params;
        fastcgi_pass unix:/tmp/fastcgi_app.sock;
    }
...

nohup ./cgi-bin/api.cgi &
}

## Database

Environment variable path:
CODEFOLIO_DB_PATH

# Author

Raymond Marx
