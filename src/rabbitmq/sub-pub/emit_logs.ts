import amqp from "amqplib/callback_api";
import {Exchange} from "./enums/exchange.ts";

amqp.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }
        var msg = process.argv.slice(2).join(' ') || 'Hello World!';

        channel.assertExchange(Exchange.LOGS, 'fanout', {
            durable: false
        })

        channel.publish(Exchange.LOGS, '', Buffer.from(msg))
        console.log(` [x] Sent ${msg}`);

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    })
})