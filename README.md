# Stressd
## A Raspberry Pi Load Testing Tool

![http://71.19.156.55/images/stressd.png](http://71.19.156.55/images/stressd.png)

## Inspired by

http://www.mnot.net/blog/2011/05/18/http_benchmark_rules

## Coder for Raspberry Pi

### Getting Started

First, you'll need Coder on your Raspberry Pi. http://googlecreativelab.github.io/coder/ 

Once you have that hotness running and available from your host computer:

1. run ./zip_for_coder.sh
2. import the resulting stressd.zip into Coder by clicking on the Green [+] at https://coder.local/app/coder/ and clicking the file upload icon

Checkout http://coder.local/app/stressd for a bare-bones HTML form.

### Example Servers

Under the `example/` directory, you'll find a server that can be used to test against locally. It's in sinatra, so `bundle` in the directory before trying to run the server.

``` bash
> example/serve.sh # to run the server
```

### SSHing to your Pi

``` bash
> ssh pi@coder.local
```
Supply the password you used when you set up the Coder application.

## Go stressd service

### Installing on Raspberry Pi

There is a script included to install golang on the Pi. Run it when you're able to `ssh pi@coder.local`.

``` bash
./copy_to_coder.sh
```

You may need extra disk space on your Pi to hold the go libraries. There's extra space in the Coder image. There are two options here:

- Use `sudo raspi-config` and `expand_rootfs` as described here: https://github.com/googlecreativelab/coder/issues/54
- Use the included `./home_partition.sh`:

``` bash
scp home_partition.sh pi@coder.local:~/
ssh pi@coder.local '~/home_partition.sh'
```

### TODOs

See https://github.com/anachronistic/stressd/issues.
