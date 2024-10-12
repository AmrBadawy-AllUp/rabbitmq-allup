import ampq from 'amqplib/callback_api'
import {Exchange} from "./enum/exchange.ts";


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
        const order = {
            id: 1,
            products: [1, 2, 3]
        }
        channel.publish(Exchange.ORDERS, 'create-order', Buffer.from(JSON.stringify(order)));

        console.log(` [x] Sent:`, order);

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    })
})