import { Kafka } from "kafkajs";


export class Topic {
    // constructor() {
    //     this.create()
    // }

    async create() {
        try {
            // kafka bğlantısı kuruluyor.
            const kafka = new Kafka({
                clientId: "kafka_doviz_kurlari",
                brokers: ["0.0.0.0:9092"]
            });
            // kafkajs' den admin bağlantısı istiyoruz. Bu sayade topicleri oluşturacağız.
            const admin = kafka.admin();
            console.log("Kafka Broker'a bağlanılıyor...");
            await admin.connect();

            // Kafkada daha önce oluşturulan topiclerin listesi alınıyor.
            const topics = await admin.listTopics()
            // Listenin içinde bizim oluşturmak istediğimiz yok ise oluşturuyor var ise konsola "Topic daha önceden oluşturulmuştur" yazıyor.
            if (!topics.includes('DovizKurlari')) {
                console.log("Kafka Broker'a bağlantı başarılı, Topic üretilecek..");
                await admin.createTopics({
                    topics: [
                        {
                            topic: "DovizKurlari",
                            numPartitions: 1
                        }
                    ]
                });
                console.log("Topic Başarılı bir şekilde oluşturulmuştur...");
            }
            else {
                console.log("Topic daha önceden oluşturulmuştur...");
            }

            await admin.disconnect();
        } catch (error) {
            console.log("Bir Hata Oluştu", error);
        }
    }

}

// const topic = new Topic()