# Blockchain Simulation App

A simple JavaScript application to simulate the functionality of a blockchain.

## Features

- **Blockchain Simulation**: Mimics the basic operations of a blockchain.
- **Docker Compose Integration**: Easily spin up and manage three nodes for the simulation.
- **Node Communication**: Nodes communicate seamlessly within the network for synchronization.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/blockchain-simulation-app.git
    cd blockchain-simulation-app
    ```

2. Start the nodes using Docker Compose:
    ```bash
    docker-compose up
    ```

### Routes

- **GET /mine**: Mines a new block.
- **GET /blockchain**: Returns the current blockchain and its contents.
- **POST /transaction**: Creates a new transaction to be mined.
- **GET /replace_chain**: Activates nodes to synchronize with other nodes.

### Node Behavior

- **Automatic Network Formation**: Upon startup, each node automatically connects to all other nodes in the network.
- **Periodic Consistency Checks**: Every second, nodes ping each other to ensure consistency within the blockchain.

## Usage

- Access the routes using your preferred method (e.g., Postman, browser, curl).
- Monitor the blockchain operations and node interactions in real-time.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
