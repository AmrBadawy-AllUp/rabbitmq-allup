import amqp from "amqplib/callback_api";
import {queues} from "./enums/queues.ts";
// Create connection
amqp.connect('amqp://localhost', (_err, conn) => {
    // Create channel
    conn.createChannel((_err, channel) => {
        // Name of the queue
        const q = queues.TASK_QUEUE
        // Declare the queue
        channel.assertExchange(q, 'fanout', {
            durable: false
        })

        // Wait for Queue Messages
        console.log(` [*] Waiting for messages in ${q}. To exit press CTRL+C`)
        channel.consume(q, msg => {
                if (!msg) return
                const secs = msg.content.toString().split('.').length - 1
                console.log(` [x] Received ${msg.content.toString()}`)
                setTimeout(() => {
                    console.log(" [x] Done")
                }, secs * 1000)
            }, {
                noAck: true
            }
        )
    })
})