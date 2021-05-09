#!/bin/bash

# Run this script as superuser
# This script was made for Ubuntu 20.04
# It creates a superuser (to run project under)
# with $USERNAME and $PASS, ssh key.
# It installs:
# nodejs, docker, docker-compose, psql and redis clients.
# Using ssh key the script gets $REPO_NAME repository's files from github
# and finally builds the project

set -e

function pressKeyToContinue() {
    MESSAGE=$1
    echo $MESSAGE
    read -t 1000 -n 1
}

USERNAME=$1
PASS=$2
REPO_NAME=ts-node-starter
NEW_USER_HOME="/home/$USERNAME"

apt -y update
apt -y install docker.io expect postgresql-client redis-tools

# Create user to run ts-node-starter
adduser --disabled-password --gecos "" $USERNAME
usermod -aG sudo,docker $USERNAME
echo "$USERNAME:$PASS" | chpasswd
cd $NEW_USER_HOME

# copy current user's authorized_keys file
mkdir -p .ssh
cp ~/.ssh/authorized_keys .ssh/authorized_keys
# create a deploy ssh key
ssh-keygen -t ed25519 -f .ssh/$REPO_NAME -P "" -C "$USERNAME@$(hostname)"
chown $USERNAME:$USERNAME .ssh -R

echo "Installing docker-compose..."
wget https://github.com/docker/compose/releases/download/1.27.4/docker-compose-Linux-x86_64
mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "
eval \$(ssh-agent)
ssh-add ~/.ssh/$REPO_NAME
" >> .profile
echo "pkill ssh-agent" >> .bash_logout

echo "Creating dirs and cloning repository"
mkdir -p project-dir/log
chown $USERNAME:$USERNAME project-dir -R

echo "Add this deploy key to $REPO_NAME repository:"
cat $NEW_USER_HOME/.ssh/$REPO_NAME.pub
pressKeyToContinue "Then press any key to continue..."

su -l $USERNAME -c "
function pressKeyToContinue() {
    MESSAGE=\$1
    echo \$MESSAGE
    read -t 1000 -n 1
}

cd $NEW_USER_HOME/project-dir
expect <<EOF
spawn git clone git@github.com:vt156/$REPO_NAME.git
expect \"Are you sure you want to continue connecting\"
send \"yes\n\"
expect eof
exit
EOF

cd $REPO_NAME
cp .env.example .env
pressKeyToContinue \"Edit your .env file, then press any key to continue...\"

docker-compose build

cp ./cronfile /var/spool/cron/crontabs/$USERNAME
crontab /var/spool/cron/crontabs/$USERNAME
"

cd project-dir/$REPO_NAME
su $USERNAME