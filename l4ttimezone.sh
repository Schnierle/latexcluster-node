# set noninteractive installation
export DEBIAN_FRONTEND=noninteractive

# set your timezone
ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
dpkg-reconfigure --frontend noninteractive tzdata
