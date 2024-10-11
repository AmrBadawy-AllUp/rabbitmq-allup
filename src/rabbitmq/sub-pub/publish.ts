import amqp from "amqplib/callback_api";
import {queues} from "./enums/queues.ts";

// Create connection
amqp.connect('amqp://localhost', (_err, conn) => {
    if (_err) {
        console.log("Error connecting to RabbitMQ")
        process.exit(1)
    }
    // Create channel
    conn.createChannel((_err, channel) => {
        if (_err) {
            console.log("Error creating channel")
            process.exit(1)
        }
        const msg = process.argv.slice(2).join(' ') || "Hello World!...";

        channel.assertExchange(queues.LOGS, 'fanout', {
            durable: false
        });
        channel.publish(queues.LOGS, '', Buffer.from(msg));
        console.log(" [x] Sent '%s'", msg);
        // Close the connection and exit
        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 500)
    })
})
