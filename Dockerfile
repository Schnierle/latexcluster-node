FROM ubuntu:18.04

RUN apt-get update

RUN DEBIAN_FRONTEND=noninteractive apt install -y tzdata

RUN apt install -y nodejs

RUN apt install -y npm

RUN apt-get install -y texlive-full

RUN apt-get install -y imagemagick

RUN apt-get install -y pdf2svg

RUN mkdir -p /home/launcher

COPY ./launcher/package.json /home/launcher

RUN mv /etc/ImageMagick-6/policy.xml /etc/ImageMagick-6/policy.xml.off 2> /dev/null

WORKDIR /home/launcher
RUN npm install

COPY ./launcher /home/launcher

# Add a new user "john" with user id 1337
RUN useradd -u 1337 john

RUN chown -R john: ./
RUN chmod u+w ./

# Change to non-root privilege
USER john

CMD node server.js
