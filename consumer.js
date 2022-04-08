import { Topic } from "./createTopic.js"
import { Kafka } from "kafkajs";

class Consumer {
    topic = null

    constructor() {
        this.topic = new Topic()
        this.getKafkaTopic();
    }

    async getKafkaTopic() {
        // Kafka topic eğer oluşturulmadıysa hata verecektir. Bu yüzden çalışmadan önce ilk topic oluşturuluyor.
        // İç yapısında topic kontrolü yapıldığı için sürekli çalışmasında problem yok.
        await this.topic.create()

        try {
            // kafka bağlantısı açılıyor.
            const kafka = new Kafka({
                clientId: "kafka_doviz_kurlari",
                brokers: ["0.0.0.0:9092"]
            });

            // consumer bağlantısı açılıyor. GrupId kendimiz adlandırıyoruz.
            const consumer = kafka.consumer({
                groupId: "doviz_kurlari_1"
            });
            console.log("Producer'a bağlanılıyor..");
            await consumer.connect();
            console.log("Bağlantı başarılı.");

            // Consumer Subscribe oluyor.
            await consumer.subscribe({
                topic: 'DovizKurlari',
                fromBeginning: true
            });

            // Consume işlemi başlatılıyor.
            await consumer.run({
                eachMessage: async result => {
                    console.log(
                        `\n \n Gelen Mesaj ${result.message.value}, Par => ${result.partition} \n \n`
                    );
                }
            });

        } catch (error) {
            console.log("Bir Hata Oluştu", error);
        }
    }

}

const c = new Consumer();