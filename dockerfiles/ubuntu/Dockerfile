FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update \
    && apt-get install -y --no-install-recommends software-properties-common=0.99.9.8 \
    && add-apt-repository -y ppa:git-core/ppa \
    && add-apt-repository -y ppa:beineri/opt-qt-5.15.2-focal \
    && apt-get -y update \
    && apt-get install -y --no-install-recommends \
        sudo=1.8.31-1ubuntu1.2 \
        apt-utils=2.0.9 \
        git=1:2.37.1-0ppa1~ubuntu20.04.1 \
        wget=1.20.3-1ubuntu2 \
        xz-utils=5.2.4-1ubuntu1.1 \
        libasound2=1.2.2-2.1ubuntu2.5 \
        libnss3=2:3.49.1-1ubuntu1.8 \
        xvfb=2:1.20.13-1ubuntu1~20.04.3 \
        shellcheck=0.7.0-2build2 \
        qt515tools=5.15.2-1basyskom1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget --no-verbose -O /usr/bin/hadolint https://github.com/hadolint/hadolint/releases/download/v2.10.0/hadolint-Linux-x86_64 \
    && chmod +x /usr/bin/hadolint

RUN FILENAME="node-v16.16.0-linux-x64.tar.xz" \
    && wget --no-verbose -O "/opt/$FILENAME" "https://nodejs.org/dist/v16.16.0/$FILENAME" \
    && tar -C /usr/local --strip-components 1 -xJf "/opt/$FILENAME" \
    && rm "/opt/$FILENAME"

ENV QT_BASE_DIR=/opt/qt515
ENV QTDIR=$QT_BASE_DIR
ENV PATH=$QT_BASE_DIR/bin:$PATH
ENV LD_LIBRARY_PATH=$QT_BASE_DIR/lib:$LD_LIBRARY_PATH
ENV PKG_CONFIG_PATH=$QT_BASE_DIR/lib/pkgconfig:$PKG_CONFIG_PATH

CMD ["/bin/bash"]
