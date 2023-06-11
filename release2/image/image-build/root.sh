#!/bin/bash


mylog(){
    echo "===== " $1 " ====="
}


## basic utils
mylog "start basic utils"
apt-get -y update
apt-get install -y zsh direnv fzf jq unzip sqlite3 cmake
snap install --classic ripgrep
mylog "end basic utils"
