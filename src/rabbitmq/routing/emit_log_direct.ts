import amqp from "amqplib/callback_api";
import {Exchange} from "./enums/exchange.ts";

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: emit_log_direct.ts [info|warning|error] [message]");
    process.exit(1);
}

amqp.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }
        const [severity, message] = args;

        channel.assertExchange(Exchange.DIRECT_LOGS, 'direct', {
            durable: false
        })
        channel.publish(Exchange.DIRECT_LOGS, severity, Buffer.from(message)); // severity is the routing key

        console.log(` [x] Sent ${severity}: ${message}`);

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    })
})