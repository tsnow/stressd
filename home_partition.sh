#!/bin/bash

# Mounting /home/pi under an 800Mb partition
# ssh pi@coder.local, then run this file.

if [[ -e “/dev/mmcblk0p3” ]]; then
  echo “Partition 3 already created”;
else

  # print the part table, then add a new partition, 3, with the remaining space on the disk.
  echo “p
n
p
3
5785600
7744511
w
“ | sudo fdisk /dev/mmcblk0
  # Command (m for help): p # n p 3 5785600 (default 7744511) w
  
  sudo partprobe # make the os aware of the new device
  sudo mkfs /dev/mmcblk0p3 # add an ext2 filesystem to it
fi 

sudo grep mmcblk0p3 /etc/fstab;
if [[ “$?” == “0”]]; then 
  echo “Add
/dev/mmcblk0p3 /home/pi ext2 defaults 0 3
to /etc/fstab”

  sudo vim /etc/fstab 

  # pi@coder:~$ cat /etc/fstab
  # proc /proc proc defaults 0 0
  # /dev/mmcblk0p1 /boot vfat defaults 0 2
  # /dev/mmcblk0p2 / ext4 defaults,noatime 0 1
  # /dev/mmcblk0p3 /home/pi ext2 defaults 0 3
  # # a swapfile is not a swap partition, so no using swapon|off from here on, use dphys-swapfile swap[on|off] for that
fi

sudo mv /home/pi /home/pi2 
sudo mkdir /home/pi
sudo mount -a
sudo chown -R pi /home/pi
mv /home/pi2/* /home/pi/
for i in .bash_history .bashrc .profile .viminfo; do mv /home/pi2/$i /home/pi/; done
sudo rmdir /home/pi2
