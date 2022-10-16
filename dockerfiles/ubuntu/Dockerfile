FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# hadolint ignore=DL3008
RUN apt-get -y update \
    && apt-get install -y --no-install-recommends software-properties-common \
    && add-apt-repository -y ppa:git-core/ppa \
    && add-apt-repository -y ppa:beineri/opt-qt-5.15.2-focal \
    && apt-get -y update \
    && apt-get install -y --no-install-recommends \
        sudo \
        apt-utils \
        git \
        wget \
        xz-utils \
        libasound2 \
        libnss3 \
        xvfb \
        shellcheck \
        qt515tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget --no-verbose -O /usr/bin/hadolint https://github.com/hadolint/hadolint/releases/download/v2.10.0/hadolint-Linux-x86_64 \
    && chmod +x /usr/bin/hadolint

RUN FILENAME="node-v16.16.0-linux-x64.tar.xz" \
    && wget --no-verbose -O "/opt/$FILENAME" "https://nodejs.org/dist/v16.16.0/$FILENAME" \
    && tar -C /usr/local --strip-components 1 -xJf "/opt/$FILENAME" \
    && rm "/opt/$FILENAME"

RUN ln -s /opt/qt515/bin/qmlformat /usr/bin/qmlformat

ENV QT_BASE_DIR=/opt/qt515
ENV QTDIR=$QT_BASE_DIR
ENV PATH=$QT_BASE_DIR/bin:$PATH
ENV LD_LIBRARY_PATH=$QT_BASE_DIR/lib:$LD_LIBRARY_PATH
ENV PKG_CONFIG_PATH=$QT_BASE_DIR/lib/pkgconfig:$PKG_CONFIG_PATH

CMD ["/bin/bash"]
