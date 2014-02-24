FROM mischief/docker-golang
ADD . /root/go/src/stressd
WORKDIR /root/go/src/stressd
RUN go get