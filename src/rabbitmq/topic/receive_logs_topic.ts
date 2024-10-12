import ampq from 'amqplib/callback_api'
import {Exchange} from "./enum/exchange.ts";

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: receive_logs_topic.ts <facility>.<severity>");
    process.exit(1);
}


ampq.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        channel.assertExchange(Exchange.TOPIC_LOGS, 'topic', {
            durable: false
        })

        channel.assertQueue('', {
            exclusive: true
        }, (error2, {queue}) => {
            if (error2) {
                throw error2
            }

            console.log(` [*] Waiting for logs. To exit press CTRL+C`);
            for (const routingKey of args) {
                channel.bindQueue(queue, Exchange.TOPIC_LOGS, routingKey);
            }

            channel.consume(queue, (message) => {
                if (!message) {
                    return;
                }
                console.log(` [x] ${message.fields.routingKey}: ${message.content.toString()}`);
            }, {
                noAck: true
            });
        });
    })
})