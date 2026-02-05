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
    private array $log_buffer = [];
    private int $last_log = 0;

    public function __construct(LoopInterface $loop) {
        $this->browser = new Browser($loop);
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients[$conn->resourceId] = $conn;
        echo "New client has connected: {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, MessageInterface $data) {
        echo "[{$from->resourceId}] $data\n";
        $decoded = json_decode($data, true) ?? [];

        if (isset($decoded['role'])) {
            if ($decoded['role'] === 'arduino') {
                $this->arduino = $from;
                unset($this->clients[$from->resourceId]);
                echo "New arduino client: {$from->resourceId}\n";
            }
            return;
        }

        $postlogs_payload = ['component' => $decoded['component']];

        if ($decoded['component'] !== 'SWING') {
            $decoded['value'] = round($decoded['value'] * 2.55);
            if ($this->arduino !== null) $this->arduino->send(json_encode($decoded));
        }
        else if ($this->arduino !== null) $this->arduino->send($data);

        switch ($decoded['component']) {
            case "SWING":
                $postlogs_payload['description'] = $decoded['value'] === 1 ? "Fan swing ON" : "Fan swing OFF";
                break;
            case "FAN":
                $postlogs_payload["description"] = $decoded["value"] === 0 ? "Turned OFF" : "Set speed: {$decoded['value']}";
                break;
            default:
                $postlogs_payload["description"] = $decoded["value"] === 0 ? "Turned OFF" : "Set brightness: {$decoded['value']}";
                break;
        }

        $this->log_buffer[] = $postlogs_payload;

        if (time() - $this->last_log < 0.75) return;

        $this->last_log = time();
        $postlogs_payload = array_shift($this->log_buffer);

        $this->browser->post(
            'http://127.0.0.1/arduino-dcmotor/post-logs.php',
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
