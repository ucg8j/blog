---
title: Dual Booting Ubuntu and Windows 10 on a Dell XPS 13
slug: dual-booting-ubuntu-and-windows-10-on-a-dell-xps
date_published: 2017-09-20T15:13:08.000Z
date_updated: 2019-08-04T12:14:04.000Z
tags: windows, ubuntu, os
layout: layouts/post.njk
---

**My Setup**: [Dell XPS 13-9360](http://www.dell.com/en-uk/shop/laptop-and-2-in-1-pcs/xps-13/spd/xps-13-9360-laptop) + Windows 10

**Aim** - Get Ubuntu on the machine.

Essentially, follow [these instructions](https://askubuntu.com/a/868294/424657) with two key modifications.

1. You should be able to get away with switching from [RAID](https://en.wikipedia.org/wiki/RAID) to [AHCI](https://en.wikipedia.org/wiki/Advanced_Host_Controller_Interface) without re-imaging windows using [these instuctions](http://triplescomputers.com/blog/uncategorized/solution-switch-windows-10-from-raidide-to-ahci-operation/).
2. Disable [Bitlocker](https://en.wikipedia.org/wiki/RAID) - this is crucial! The first time I ran this... I didn't complete this step which led me to screwing up my Windows 10 installation.

I neglected Step 2. If the boot priority is Ubuntu first (i.e. Grub) then Ubuntu loads fine. However, windows doesn't load as the Bitlocker detects a change to the BIOS and will require a code to unlock it which, if you're like me, you probably don't have.

I did try running through the [boot-repair tool](https://help.ubuntu.com/community/Boot-Repair) from Ubuntu but kept facing the `GPT detected... ` error.

**Solution:** I use the BIOS boot priority to change the operating system. Now both Win10 and Ubuntu are running on my machine.

## Resources

- [Main instuctions](https://askubuntu.com/a/868294/424657)
- [Switching from RAID to AHCI without re-imaging Win10](http://triplescomputers.com/blog/uncategorized/solution-switch-windows-10-from-raidide-to-ahci-operation/)
- [Turn off Bitlocker](http://triplescomputers.com/blog/uncategorized/solution-switch-windows-10-from-raidide-to-ahci-operation/)
- [Reddit thread](https://www.reddit.com/r/Dell/comments/5xw27t/dell_xps_15_9560_dualboot_windows_10_ubuntu_lts/)
