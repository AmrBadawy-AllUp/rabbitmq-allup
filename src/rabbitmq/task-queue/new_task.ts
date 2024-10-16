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
        const queue = queues.TASK_QUEUE;
        const msg = process.argv.slice(2).join(' ') || "Hello World!...";

        channel.assertQueue(queue, {
            durable: true // Message will survive broker restarts
        }, (_err, _ok) => {
            if (_err) {
                console.log("Error creating queue", _err.message)
                process.exit(1)
            }
        });
        channel.prefetch(1); // Don't dispatch a new message to a worker until it has processed and acknowledged the previous one
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true // Message will be saved to disk
        });
        console.log(" [x] Sent '%s'", msg);
        // Close the connection and exit
        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 500)
    })
})
