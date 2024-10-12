import ampq from 'amqplib/callback_api'
import {Exchange} from "./enum/exchange.ts";

const args = process.argv.slice(2);
if(args.length < 2) {
    console.log("Usage: emit_log_topic.ts facility>.<severity> [message]");
    process.exit(1);
}
const [[bindingKey, severity], message] = [args[0].split('.'), args[1]];

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
        channel.publish(Exchange.TOPIC_LOGS, `${bindingKey}.${severity}`, Buffer.from(message)); // severity is the routing key

        console.log(` [x] Sent ${bindingKey}.${severity}: ${message}`);

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    })
})