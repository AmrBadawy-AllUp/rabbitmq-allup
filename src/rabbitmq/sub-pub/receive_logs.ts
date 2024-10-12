import ampq from 'amqplib/callback_api'
import {Exchange} from "./enums/exchange.ts";
import {Queue} from "./enums/queue.ts";

ampq.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error
        }
        channel.assertExchange(Exchange.LOGS, 'fanout', {
            durable: false
        })

        channel.assertQueue(Queue.TEMP // the queue will be a random name assigned by RabbitMQ
            , {
                exclusive: true // the queue will be deleted once the connection is closed
            }, (error2, queue) => {
                if (error2) {
                    throw error2;
                }
                console.log(` [*] Waiting for messages in ${queue.queue}. To exit press CTRL+C`);
                channel.bindQueue(Queue.TEMP, Exchange.LOGS, '')

                channel.consume(Queue.TEMP, message => {
                    if (!message) {
                        return
                    }
                    console.log(` [x] ${message.content.toString()}`);

                }, {
                    noAck: true
                })
            })
    })
})