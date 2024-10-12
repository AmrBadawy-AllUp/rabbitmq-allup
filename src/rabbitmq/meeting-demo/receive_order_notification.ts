import ampq from 'amqplib/callback_api';
import {Exchange} from "./enum/exchange.ts";
import {Queue} from "./enum/queue.ts";
import {RoutingKey} from "./enum/RoutingKey.ts";

ampq.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        channel.assertExchange(Exchange.ORDERS, 'topic', {
            durable: true // make sure that the exchange will survive a RabbitMQ node restart
        })
        channel.assertQueue(Queue.NOTIFICATION, {
            durable: true // make sure that the queue will survive a RabbitMQ node restart
        }, (error2, {queue}) => {
            if (error2) {
                throw error2;
            }

            console.log(` [*] Waiting for messages in ${queue}`);

            channel.bindQueue(queue, Exchange.ORDERS, RoutingKey.CREATE_ORDER);

            channel.consume(queue, (message) => {
                if (!message || !message.content) {
                    return;
                }
                console.log(` [x] ${message.fields.exchange}|${queue}|${message.fields.routingKey}: ${message.content.toString()}`);
                channel.ack(message);
            }, {
                noAck: false // make sure that the message will be acknowledged by the consumer
            });
        });
    })
})