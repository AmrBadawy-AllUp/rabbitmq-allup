import amqp from "amqplib/callback_api";
import {queues} from "./enums/queues.ts";
// Create connection
amqp.connect('amqp://localhost', (_err, conn) => {
    // Create channel
    conn.createChannel((_err, channel) => {
        // Name of the queue
        const q = queues.TASK_QUEUE
        // Declare the queue
        channel.assertQueue(q, {durable: true}, (_err, _ok) => {
            if (_err) {
                console.log("Error creating queue", _err.message)
                process.exit(1)
            }
        })

        // Wait for Queue Messages
        console.log(` [*] Waiting for messages in ${q}. To exit press CTRL+C`)
        channel.consume(q, msg => {
                if (!msg) return
                const secs = msg.content.toString().split('.').length - 1
                console.log(` [x] Received ${msg.content.toString()}`)
                setTimeout(() => {
                    console.log(" [x] Done")
                    channel.ack(msg) // acknowledge the message, if not acknowledged, it will be requeued
                }, secs * 1000)
            }, {
                noAck: false // manual acknowledgment mode
            }
        )
    })
})