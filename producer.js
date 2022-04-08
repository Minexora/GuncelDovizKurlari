import axios from "axios";
import X2JS from "x2js";
import { Topic } from "./createTopic.js"
import { Kafka } from "kafkajs";

class Producer {
    x2js = new X2JS();
    payloadJson = []
    topic = null

    constructor() {
        this.topic = new Topic()
        this.getExchangeRates();
    }

    async getExchangeRates() {
        try {
            // axios ile source kod çekildi.
            const sourceCode = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml')
            // çekilen source kod xml formatındaydı. Xml veriyi json yapısına çevildi. Çevrilirken X2JS tool kullanıldı.
            const json = await this.xmlConvetJson(sourceCode.data)
            // gönderilecek olan json istenilen formata çevriliyor.
            json.Tarih_Date.Currency.forEach(item => {
                this.payloadJson.push({
                    name: item.Isim,
                    value: item.ForexBuying
                })
            });
            console.log(this.payloadJson);
            // elde edilen payload kafka topic ' e gönderilecek
            await this.sendKafkaTopic()
        } catch (err) {
            console.log(`Hata ile  kaşılaşıldı. Hata: ${err}`)
        }
    }

    async xmlConvetJson(source) {
        return await this.x2js.xml2js(source);
    }

    async sendKafkaTopic() {
        // Kafka topic eğer oluşturulmadıysa hata verecektir. Bu yüzden çalışmadan önce ilk topic oluşturuluyor.
        // İç yapısında topic kontrolü yapıldığı için sürekli çalışmasında problem yok.
        await this.topic.create()

        try {
            // kafka bağlantısı açılıyor.
            const kafka = new Kafka({
                clientId: "kafka_doviz_kurlari",
                brokers: ["0.0.0.0:9092"]
            });

            // producer bağlantısı açılıyor.
            const producer = kafka.producer();
            console.log("Producer'a bağlanılıyor..");
            await producer.connect();
            console.log("Bağlantı başarılı.");

            // mesaj kafkanın DovizKurlari adlı topic 0. partition a gönderilmektedir.
            // multiple işlemlerde  groupConsumer ve partition çok önem kazanmaktadır.
            const message_result = await producer.send({
                topic: 'DovizKurlari',
                messages: [
                    {
                        value: JSON.stringify(this.payloadJson, null, 2),
                        partition: 0
                    }
                ]
            });
            console.log("Gonderim işlemi başarılıdır", JSON.stringify(message_result));
            await producer.disconnect();
        } catch (error) {
            console.log("Bir Hata Oluştu", error);
        }
    }

}

const p = new Producer();