import amqp from "amqplib/callback_api";
// Create connection
amqp.connect('amqp://localhost', (_err, conn) => {
    // Create channel
    conn.createChannel((_err, channel) => {
        // Name of the queue
        const q = 'hello'
        // Declare the queue
        channel.assertQueue(q, { durable: false })

        // Send message to the queue
        channel.sendToQueue(q, Buffer.from('Hello World!'))
        console.log(" {x} Sent 'Hello World'")

        // Close the connection and exit
        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 500)
    })
})