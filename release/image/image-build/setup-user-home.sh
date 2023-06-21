#!/bin/bash


mkdir -p ${HOME}/projects/hotoku
git clone git@github.com:hotoku/dot-emacs --recursive ${HOME}/projects/hotoku/dot-emacs
git clone git@github.com:hotoku/dot ${HOME}/projects/hotoku/dot


rm -f ${HOME}/.zshrc
ln -s ${HOME}/projects/hotoku/dot/.zshrc ${HOME}/.zshrc
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"


ln -s ${HOME}/projects/hotoku/dot-emacs ${HOME}/.emacs.d
ln -s ${HOME}/projects/hotoku/dot/tmux.basic.conf ${HOME}/.tmux.conf
ln -s ${HOME}/projects/hotoku/dot/gitconfig ${HOME}/.gitconfig


sudo chsh -s $(which zsh) hotoku
