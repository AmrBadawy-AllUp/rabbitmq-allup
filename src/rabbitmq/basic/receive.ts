import amqp from "amqplib/callback_api";
// Create connection
amqp.connect('amqp://localhost', (_err, conn) => {
    // Create channel
    conn.createChannel((_err, channel) => {
        // Name of the queue
        const q = 'hello'
        // Declare the queue
        channel.assertQueue(q, {durable: false})

        // Wait for Queue Messages
        console.log(` [*] Waiting for messages in ${q}. To exit press CTRL+C`)
        channel.consume(q, msg => {
                console.log(` [x] Received ${msg?.content.toString()}`)
            }, {noAck: true}
        )
    })
})