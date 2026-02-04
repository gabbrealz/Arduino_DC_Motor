<?php

use React\EventLoop\LoopInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use React\Http\Browser;

class WebSocketServer implements MessageComponentInterface {
    protected ?ConnectionInterface $arduino = null;
    protected array $clients = [];
    private Browser $browser;

    public function __construct(LoopInterface $loop) {
        $this->browser = new Browser($loop);
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients[$conn->resourceId] = $conn;
        echo "New client has connected: {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, MessageInterface $data) {
        $decoded = json_decode($data, true) ?? [];

        if (isset($decoded['r'])) {
            if ($decoded['r'] === 'arduino') {
                $this->arduino = $from;
                unset($this->clients[$from->resourceId]);
                echo "New arduino client: {$from->resourceId}\n";
            }
            return;
        }

        $postlogs_payload = [];

        if ($from === $this->arduino) {
            foreach ($this->clients as $client) $client->send($data);

            $postlogs_payload['component'] = $decoded['c'];
            $postlogs_payload['description'] = (string) $decoded['d'];
        }
        else {
            if ($this->arduino !== null) $this->arduino->send($data);

            $postlogs_payload['component'] = $decoded['c'];
            $postlogs_payload['description'] = (string) $decoded['d'];
        }

        $this->browser->post(
            'http://127.0.0.1/arduino-dcmotor-backend/post-logs.php',
            ['Content-Type' => 'application/json'],
            json_encode($postlogs_payload)
        )->then(
            function ($response) { echo "Data was logged!\n"; },
            function ($error) { echo "\nFailed to log: {$error->getMessage()}\n\n"; }
        );
    }

    public function onClose(ConnectionInterface $conn) {
        if ($conn === $this->arduino) {
            $this->arduino = null;
            echo "Arduino client: {$conn->resourceId} disconnected.\n";
            return;
        }

        unset($this->clients[$conn->resourceId]);
        echo "Client: {$conn->resourceId} disconnected.\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "\nError with client: {$conn->resourceId}\n";
        echo "Closing connection due to: {$e->getMessage()}\n\n";
        $conn->close();
    }
}
