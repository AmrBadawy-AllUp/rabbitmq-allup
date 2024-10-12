# run receive_logs
/home/amr/.nvm/versions/node/v20.17.0/bin/node --import file:/home/amr/.local/share/JetBrains/Toolbox/apps/webstorm/plugins/nodeJS/js/ts-file-loader/node_modules/tsx/dist/loader.cjs /home/amr/source/repos/AmrBadawy-AllUp/learning/rabbitmq-allup/src/rabbitmq/sub-pub/recieve_logs.ts > /home/amr/source/repos/AmrBadawy-AllUp/learning/rabbitmq-allup/src/rabbitmq/sub-pub/logs_from_rabbit.log
# run emit_logs
/home/amr/.nvm/versions/node/v20.17.0/bin/node --import file:/home/amr/.local/share/JetBrains/Toolbox/apps/webstorm/plugins/nodeJS/js/ts-file-loader/node_modules/tsx/dist/loader.cjs /home/amr/source/repos/AmrBadawy-AllUp/learning/rabbitmq-allup/src/rabbitmq/sub-pub/emit_logs.ts
# list bindings
sudo rabbitmqctl list_bindings
# Listing bindings for vhost /...
# source_name	source_kind	destination_name	destination_kind	routing_key	arguments
# LOGS	exchange	amq.gen-C4FI08K9eJAzxhTVkVMPkA	queue	amq.gen-C4FI08K9eJAzxhTVkVMPkA	[]


