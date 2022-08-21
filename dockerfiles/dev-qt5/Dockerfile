FROM ubuntu:20.04

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update \
    && apt-get install -y --no-install-recommends software-properties-common=0.99.9.8 \
    && add-apt-repository -y ppa:git-core/ppa \
    && add-apt-repository -y ppa:beineri/opt-qt-5.15.2-focal \
    && apt-get -y update \
    && apt-get install -y --no-install-recommends \
        sudo=1.8.31-1ubuntu1.2 \
        apt-utils=2.0.9 \
        git=1:2.37.2-0ppa1~ubuntu20.04.1 \
        wget=1.20.3-1ubuntu2 \
        vim=2:8.1.2269-1ubuntu5.7 \
        ssh=1:8.2p1-4ubuntu0.5 \
        xz-utils=5.2.4-1ubuntu1.1 \
        libasound2=1.2.2-2.1ubuntu2.5 \
        libnss3=2:3.49.1-1ubuntu1.8 \
        xvfb=2:1.20.13-1ubuntu1~20.04.3 \
        python3-pip=20.0.2-5ubuntu1.6 \
        shellcheck=0.7.0-2build2 \
        qt515tools=5.15.2-1basyskom1 \
        bash-completion=1:2.10-1ubuntu1 \
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

RUN ln -s /opt/qt515/bin/qmlformat /usr/bin/qmlformat

USER $USERNAME

RUN pip3 install --no-cache-dir \
        pre-commit==2.20.0

ENV QT_BASE_DIR=/opt/qt515
ENV QTDIR=$QT_BASE_DIR
ENV PATH=$QT_BASE_DIR/bin:/home/$USERNAME/.local/bin:$PATH
ENV LD_LIBRARY_PATH=$QT_BASE_DIR/lib:$LD_LIBRARY_PATH
ENV PKG_CONFIG_PATH=$QT_BASE_DIR/lib/pkgconfig:$PKG_CONFIG_PATH

CMD ["/bin/bash"]
