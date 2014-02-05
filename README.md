# Stressd
## A Raspberry Pi Load Testing Tool

![http://71.19.156.55/images/stressd.png](http://71.19.156.55/images/stressd.png)

### Getting Started

First, you'll need Coder on your Raspberry Pi. http://googlecreativelab.github.io/coder/ Once you have that hotness running and available from your host computer, make a new app called 'stressd' and copy in the content of each of the files in this repo, uploading the images.

Checkout http://coder.local/app/stressd for a bare-bones HTML form.

### Example Servers

Under the `example/` directory, you'll find a server that can be used to test against locally. It's in sinatra, so `bundle` in the directory before trying to run the server.

``` bash
> example/serve.sh # to run the server
```

### TODOs

1. Wire the form up to client-side AJAX 
