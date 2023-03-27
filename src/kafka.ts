import {KafkaConfig} from "./config/kafka.config";
import {Consumer, Kafka, Producer} from "kafkajs";

export class KafkaJS {
    static INSTANCE : null|KafkaJS = null;
    readonly _kafka: Kafka;

    readonly _consumer: Consumer;

    private constructor() {
        this._kafka = new Kafka({
            clientId: KafkaConfig.KAFKA_GROUP_NAME,
            brokers: [KafkaConfig.KAFKA_BOOTSTRAP_SERVER]
        })

        this._consumer = this._kafka.consumer({ groupId: KafkaConfig.KAFKA_GROUP_NAME })
        this._consumer.connect();
    }

    static getInstance()
    {
        if(null == KafkaJS.INSTANCE)
            KafkaJS.INSTANCE = new KafkaJS();

        return KafkaJS.INSTANCE
    }

    get kafka(): Kafka
    {
        return this._kafka;
    }

    get consumer(): Consumer
    {
        return this._consumer;
    }
}