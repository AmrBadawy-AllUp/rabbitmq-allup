import ampq from 'amqplib/callback_api'
import {Exchange} from "./enums/exchange.ts";
import {Queue} from "./enums/queue.ts";

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

ampq.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error
        }
        channel.assertExchange(Exchange.DIRECT_LOGS, 'direct', {
            durable: false
        })

        channel.assertQueue(Queue.TEMP // the queue will be a random name assigned by RabbitMQ
            , {
                exclusive: true // the queue will be deleted once the connection is closed
            }, (error2, {queue}) => {
                if (error2) {
                    throw error2;
                }
                console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
                for (const severity of args) {
                    channel.bindQueue(queue, Exchange.DIRECT_LOGS, severity) // severity is the routing key
                }
                channel.consume(queue, message => {
                    if (!message) {
                        return
                    }
                    console.log(` [x] ${message.fields.routingKey}: ${message.content.toString()}`);

                }, {
                    noAck: true
                })
            })
    })
})