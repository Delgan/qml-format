FROM ubuntu:22.04

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID

ENV DEBIAN_FRONTEND=noninteractive

# hadolint ignore=DL3008
RUN apt-get -y update \
    && apt-get install -y --no-install-recommends \
        sudo \
        apt-utils \
        git \
        wget \
        vim \
        ssh \
        xz-utils \
        libasound2 \
        libnss3 \
        libatk1.0-0\
        libatk-bridge2.0-0 \
        libgtk-3.0 \
        xvfb \
        python3-pip \
        shellcheck \
        qt6-declarative-dev-tools \
        bash-completion\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN wget --no-verbose -O /usr/bin/hadolint https://github.com/hadolint/hadolint/releases/download/v2.10.0/hadolint-Linux-x86_64 \
    && chmod +x /usr/bin/hadolint

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/bash-history/.bash_history" \
    && mkdir /bash-history \
    && touch /bash-history/.bash_history \
    && chown -R $USERNAME /bash-history \
    && echo "$SNIPPET" >> "/home/$USERNAME/.bashrc"

RUN FILENAME="node-v16.16.0-linux-x64.tar.xz" \
    && wget --no-verbose -O "/opt/$FILENAME" "https://nodejs.org/dist/v16.16.0/$FILENAME" \
    && tar -C /usr/local --strip-components 1 -xJf "/opt/$FILENAME" \
    && rm "/opt/$FILENAME"

RUN ln -s /usr/lib/qt6/bin/qmlformat /usr/bin/qmlformat

USER $USERNAME

RUN pip3 install --no-cache-dir \
        pre-commit==2.20.0

ENV QT_BASE_DIR=/usr/lib/qt6
ENV QTDIR=$QT_BASE_DIR
ENV PATH=$QT_BASE_DIR/bin:/home/$USERNAME/.local/bin:$PATH
ENV LD_LIBRARY_PATH=$QT_BASE_DIR/lib:$LD_LIBRARY_PATH
ENV PKG_CONFIG_PATH=$QT_BASE_DIR/lib/pkgconfig:$PKG_CONFIG_PATH

CMD ["/bin/bash"]
