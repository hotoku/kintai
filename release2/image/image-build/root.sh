#!/bin/bash


EMACS_VERSION=28.2
NODE_VERSION=19.3.0


mylog(){
    echo "===== " $1 " ====="
}


echo "install utis start"


## basic utils
echo "start basic utils"
apt update
apt install -y zsh direnv fzf jq unzip sqlite3 cmake
wget https://github.com/sharkdp/fd/releases/download/v8.2.1/fd_8.2.1_amd64.deb
dpkg -i fd_8.2.1_amd64.deb
snap install --classic ripgrep
echo "end basic utils"


## python build deps
echo "start python build deps"
apt install -y \
    make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl \
    llvm libncursesw5-dev xz-utils tk-dev libxml2-dev \
    libxmlsec1-dev libffi-dev liblzma-dev
echo "end python build deps"


## emacs
echo "start emacs"
apt install -y libgnutls28-dev libtinfo-dev pkg-config
cd /startup
wget https://ftp.gnu.org/gnu/emacs/emacs-${HOTOKU_EMACS_VERSION}.tar.xz
tar xJvf emacs-${HOTOKU_EMACS_VERSION}.tar.xz
cd emacs-${HOTOKU_EMACS_VERSION}
./configure --with-x-toolkit=no --with-xpm=ifavailable --with-jpeg=ifavailable --with-png=ifavailable --with-gif=ifavailable --with-tiff=ifavailable --with-gnutls=ifavailable
make -j60
make -j60 install
cd /
echo "end emacs"


## docker
echo "start docker"
apt install -y docker.io
gpasswd -a hotoku docker
echo "end docker"


## node
echo "start node"
cd /startup
wget https://nodejs.org/dist/${HOTOKU_NODE_VERSION}/node-${HOTOKU_NODE_VERSION}-linux-x64.tar.xz
tar xJvf node-${HOTOKU_NODE_VERSION}-linux-x64.tar.xz
export PATH=/startup/node-${HOTOKU_NODE_VERSION}-linux-x64/bin:${PATH}
echo "export PATH=/startup/node-${HOTOKU_NODE_VERSION}-linux-x64/bin:\${PATH}" >> /root/.bashrc
echo "export PATH=/startup/node-${HOTOKU_NODE_VERSION}-linux-x64/bin:\${PATH}" >> /root/.zshrc
echo "end node"


## pyright prettiier
echo "start pyright prettier"
npm i -g pyright prettier
echo "end pyright prettier"


## google cloud sdk
echo "start google cloud sdk"
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
apt install -y apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
apt -y update && sudo apt-get install -y google-cloud-sdk
echo "end google cloud sdk"


## mecab
echo "start mecab"
apt install -y mecab libmecab-dev mecab-ipadic-utf8 swig
git clone https://github.com/neologd/mecab-ipadic-neologd.git /startup/neologd
cd /startup/neologd
bin/install-mecab-ipadic-neologd -y
mv /usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd /var/lib/mecab/dic
sed -E -e "s|dicdir = /var/lib/mecab/dic/debian|dicdir = /var/lib/mecab/dic/mecab-ipadic-neologd|" -i.bak /etc/mecabrc
ln -s /etc/mecabrc /usr/local/etc/mecabrc
echo "end mecab"


## misc
echo "start misc"
apt install -y graphviz nkf


## Ops agents, cf: https://cloud.google.com/stackdriver/docs/solutions/agents/ops-agent/installation
curl -sS https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh -o /tmp/add-google-cloud-ops-agent-repo.sh
sudo bash /tmp/add-google-cloud-ops-agent-repo.sh --also-install


# cbc
apt install -y coinor-cbc


## scip
cd /startup
git clone https://github.com/scipopt/soplex.git
cd soplex
mkdir build && cd $_
cmake ..
make -j60
make install


cd /startup
git clone https://github.com/scipopt/scip.git
cd scip
mkdir build && cd $_
cmake .. -DAUTOBUILD=ON
make -j60
make install
