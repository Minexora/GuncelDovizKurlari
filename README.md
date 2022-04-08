# GuncelDovizKurlari
 - "https://www.tcmb.gov.tr/kurlar/today.xml" adresinden güncel verileri axios ile çekiliyor.
 - Çekilen verileri xml fromatından json fromatına çevriliyor.
 - Kafka bağlantısı kurularak topic oluştruluyor.
 - Oluşturulan json data Kafka'da oluşturulan topic e gönderiliyor.
 - Consumer tarafı ise topic ten verileri çekip konsole yazdırıyor.

## Kurulum
  - Ilk olarak .env dosyasına local ip adresinizi yazmanız gerekmektedir.
  - Docker imagelarının çekilmesi ve kafka'nın ayağa kaldırılması için aşağıdaki terminale komut yazılımalıdır.
    ```
      docker-compose up
    ```
  - Requirements yüklenmesi için aşağıdaki komut terminale yazılmalıdır.
    ```
      npm install
    ```
  - Projenin consumer tarafını çalıştırmak için aşağıdaki komut terminale yazılmalıdır.
    ```
      npm run consumer
    ```
  - Projenin producer tarafını çalıştırmak için aşağıdaki komut terminale yazılmalıdır.
    ```
      npm run start
    ```
  
