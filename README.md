# Bitmark-Node User Interface 

[ [Client Setup](#Client-Setup-Introduction) | [Developer Setup](#Developer-Setup) ]

### Application Screenshot
![Application Screenshot](https://i.imgur.com/n0OJz07.png)


# Client Setup Introduction

The [Bitmark](https://bitmark.com) node software enables any computer on the Internet to join the Bitmark network as a fully-validating peer. Unlike conventional property systems that rely on a handful of trusted government officials to act as centralized gatekeepers, the Bitmark blockchain is an open and transparent property system that is strengthened through the active participation of anyone on the Internet. The integrity of Bitmark’s open-source blockchain is ensured by a peer-to-peer network of voluntary participants running the Bitmark node software. These participants are incentivized to participate in verifying Bitmark property transactions through the possibility of winning monetary and property rewards.

The Bitmark blockchain is an independent chain, optimized for storing property titles, or *bitmarks*, and does not have its own internal currency (transaction fees are in bitcoin or litecoin). The peer-to-peer network is written in [Go](https://golang.org) and uses the [ZeroMQ distributed messaging library](http://zeromq.org). The consensus is secured using the [Argon2](https://github.com/P-H-C/phc-winner-argon2) hashing algorithm as proof-of-work.

The Bitmark Node User Interface is a desktop application written with the [Electron](https://electronjs.org/) framework. The program gives the user full control over the application, from controlling the container to interacting with the Bitmark node software.

## Supported Platforms

The Bitmark node software is distributed as a standalone [Docker container](https://www.docker.com/what-container), which supports easy installation on all major platforms including:

- **Desktop devices**, such as [Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac) and [Windows*](https://store.docker.com/editions/community/docker-ce-desktop-windows)
- **Linux servers**, such as [CentOS](https://store.docker.com/editions/community/docker-ce-server-centos), [Debian](https://store.docker.com/editions/community/docker-ce-server-debian), [Fedora](https://store.docker.com/editions/community/docker-ce-server-fedora), and [Ubuntu](https://store.docker.com/editions/community/docker-ce-server-ubuntu)
- **Cloud providers**, such as [AWS](https://store.docker.com/editions/community/docker-ce-aws) and [Azure](https://store.docker.com/editions/community/docker-ce-azure)

<sub>_*Docker for Windows Requires Hyper-V, which is only avaliable on Windows 8 or Windows 10 64-bit 6 Professional, Enterprise, or Education editions._</sub>

## Contents

The Bitmark node consists of the following software programs:

 - **bitmarkd** — the main program for verifying and recording transactions in the Bitmark blockchain [(view source code on GitHub)](https://github.com/bitmark-inc/bitmarkd/tree/master/command/bitmarkd)
 - **recorderd** — an auxiliary application for computing the Bitmark proof-of-work algorithm that allows nodes to compete to win blocks on the Bitmark blockchain [(view source code on GitHub)](https://github.com/bitmark-inc/bitmarkd/tree/master/command/recorderd)
 - **bitmark-wallet** — an integrated cryptocurrency wallet for receiving Bitcoin and Litecoin payments for won blocks [(view source code on GitHub)](https://github.com/bitmark-inc/bitmark-wallet)
 - **bitmark-cli** — a command line interface to `bitmarkd` [(view source code on GitHub)](https://github.com/bitmark-inc/bitmarkd/tree/master/command/bitmark-cli)
 - **bitmark-webui** — a web-based user interface to monitor and configure the Bitmark node via a web browser

## Installation

**To install the Bitmark node software, please complete the following 2 steps:**

### 1. Install Docker

The Bitmark node software is distributed as a standalone [Docker container](https://www.docker.com/what-container) which requires you to first install Docker for your operating system:


- [Get Docker CE for Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac)
- [Get Docker CE for Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows)
- [Get Docker CE for CentOS](https://store.docker.com/editions/community/docker-ce-server-centos)
- [Get Docker CE for Debian](https://store.docker.com/editions/community/docker-ce-server-debian)
- [Get Docker CE for Fedora](https://store.docker.com/editions/community/docker-ce-server-fedora)
- [Get Docker CE for Ubuntu](https://store.docker.com/editions/community/docker-ce-server-ubuntu)
- [Get Docker CE for AWS](https://store.docker.com/editions/community/docker-ce-aws)
- [Get Docker CE for Azure](https://store.docker.com/editions/community/docker-ce-azure)

### 2. Run the Bitmark Node User Interface

#### Download the Bitmark Node User Interface
- Linux
    * [Debain Package](https://github.com/zizzard/Electron-Bitmark-Node-Packages/raw/master/bitmark-node-1.0.0-amd64.deb)
    * [Red Hat Package Manager](https://github.com/zizzard/Electron-Bitmark-Node-Packages/raw/master/bitmark-node-1.0.0.x86_64.rpm)
- [Windows](https://github.com/zizzard/Electron-Bitmark-Node-Packages/raw/master/bitmark-node-1.0.0-exe.7z)
- [MacOS](https://github.com/zizzard/Electron-Bitmark-Node-Packages/raw/master/bitmark-node-1.0.0-darwin-x64.zip)

When the program is start, it will create the Docker container to run the Bitmark Node software, please note that this will take some time, as it has to download the Bitmark node software. 

## User Interface Walkthrough

### 1. Login Screen
![](https://i.imgur.com/b2ozVoE.png)

On the login screen, you can either enter your 24-word recovery phrase to log in to an existing account or you're able to create a new account. When you create a new account, you will be assigned a 24-word recovery phrase that will allow you to login to the same account after restarting the Docker container. You will also be prompted to enter a Bitcoin and Litecoin wallet address to allow you to receive any monetary awards for verifying Bitmark property transactions (these address can be changed at any time). If you do not have a Bitcoin or Litecoin wallet, see [here](#Payment-Addresses) for more information.

### 2. Startup Screen
![](https://i.imgur.com/4QgEfcf.png)

On this screen, you can start up the two parts of the Bitmark Node software, ```bitmarkd``` and ```recorderd```. By clicking on the person icon on the top of the screen you can: view your blocks won, write down your recovery phrase, and copy down your account address. By clicking on the three bar drop-down menu you can change your language, and view the Bitmark Node documentation. You can also change your cryptocurrency wallet addresses in the ```Bitmark Wallet``` section.

### 3. Running Screen
![](https://i.imgur.com/37iS2ud.png)

This full-sized menu appears once you start the ```bitmarkd``` software.


### Sidebar
* Start Container
    * If the container is stopped, this will start the container. It will do nothing if the container is not setup, or already running.
* Stop Container
    * If the container is running, this will stop the container. It will do nothing if the container is not setup, or already stopped.
* Restart Container
    * This will start the containerif it is not running, or restart the container if it is running. This will apply any updates installed manually.
* Switch to Bitmark
    * If the network is set to 'testing', this will restart the container on the 'bitmark' network. If it is already running on 'bitmark', it will do nothing.
* Switch to Testing
    * If the network is set to 'bitmark', this will restart the container on the 'testing' network. If it is already running on 'testing', it will do nothing.
* Check for Updates
    * Check for updates. If an update is found, it will automatically be installed and the container will restart.
* Show Preferences
    * Show the application preferences menu. From here you can manage automatic updates.
* Refresh Window
    * Refresh the application window. After initial setup, the container window will not refresh after changes, and must be done manually. 

### Main Application

* Bitmark Node (bitmarkd):
  * ```Status```: Either ```Stopped``` or ```Running```. Describes the state of the ```bitmarkd``` software.
  * ```Connection```: When starting up, it displays ```Checking connection…```. After connecting to the network, it will show the number of nodes that it is connected to. A connection of three nodes is required to successfully run the Bitmark Node software.
* Recorder Node (recorderd)
  * ```Status```: Either ```Stopped``` or ```Running```. Describes the state of the ```recorderd``` software.
* Network ID
  * You client's ID on the Bitmark node network.
* Current Block
  * This displays what the current block your system is on. This can either be the latest block, or the block that it is currently downloading.
* Transaction Counter
  * ```Pending```: TODO - Not 100% sure what this counts as it seems to be broken.
  * ```Verified```: TODO - Not 100% sure what this counts as it seems to be broken.
* Uptime
  * This describes the total time that the Docker container has been active for.
* Your Blocks
  * Each block in this section is for a block that your account has solved, including the date and time it was solved on, the block number, and the hash, the "solution" for that block. 

## Configuration Options

### Current Blockchain

The Bitmark node allows participants to verify and record transactions on two different Bitmark blockchains:

- `bitmark` — the official version of the Bitmark blockchain
- `testing` — a `testnet` version of the blockchain used solely for development testing

Node participants can select which blockchain they are currently working on via the web UI. Note that switching to a different blockchain will require you to restart the Docker container, selecting the new network.

The Bitmark system offers monetary rewards to block winners for both the `bitmark` and `testing` blockchains.

### Payment Addresses

[comment]: <> (TODO: Update description to describe how people actually get paid.)

Bitmark node participants running both `bitmarkd` and `recorderd` are awarded monetary payments for winning blocks on both the `bitmark` and `testing` blockchains. These payments are delivered as either bitcoin or litecoin payments (depending on current cryptocurrency prices and confirmation times) and are delivered to a node's designated bitcoin and litecoin payment addresses.

When the Bitmark node software is first started up, it requires the user to provide a bitcoin and litecoin account address. If you do not have a bitcoin or litecoin wallet, there are many ways to easily get one online. A simple, online solution is [coinbase](https://coinbase.com), though any wallet will work.


### 2. Run Bitmark Node

After the software update has successfully downloaded, you need need to restart the container, though the application sidebar. Once the container succesfully restarts, you will be running the updated software.

## Troubleshooting

#### Listening port (2136) is not accessible.
* Ensure you're connected to the internet, and Docker is running.
* This can also be caused by your router's NAT (Network Address Translation) not allowing you to access port 2136, the port used to connect to other bitmarkd nodes. To allow the node software to access this port, you must enable port forwarding on your router and forward port 2136. A good guide on how to do this is linked [here](https://www.howtogeek.com/66214/how-to-forward-ports-on-your-router).

#### Current Block Stuck at 1/1
* Once the Bitmark Node software successfully starts, it will remain at 1/1 blocks for a small period of time (approximately 15 minutes). If the node is successfully connected to at least 3 other nodes and remains stuck at 1/1 for a long period of time, restart the Docker container. If the issue persists, restart the docker container through the sidebar. 

#### HTTP: TLS Handshake Error
* To solve this error, restart the docker container through the sidebar. 

#### Storage Initialise Error
* To solve this error, restart the docker container through the sidebar. 






# Developer Setup
Built using Electron (v2.0.4) and Electron-Forge (v6.0.0-beta.22)

### Prerequisite
* Node.js 10.5.0 or newer
* npm 6.1.0 or newer
* [Electron Forge 6.0 or newer](https://github.com/electron-userland/electron-forge)

### Setup
Install npm depedencies:

```$ npm install ```

### Run
To start the application, use:

```$ electron-forge start```

### Build
To build the application, use:

```$ electron-forge build```

### Package
To package the application, use:

```$ electron-forge make```

<sub>_Creates a package for current OS only_</sub>


###### tags: `bitmark` `bitmark-node` `documentation` `run`
