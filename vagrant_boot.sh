#!/usr/bin/env bash

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade
apt-get install git -y

# install newest nodejs from repository
apt-get install python-software-properties -y  # needed to install add-apt-repository command
add-apt-repository ppa:chris-lea/node.js -y
apt-get update
apt-get install nodejs -y

npm config set registry http://registry.npmjs.org/
npm install -g npm
cd /vagrant
npm install
