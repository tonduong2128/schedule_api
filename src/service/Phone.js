import Nexmo from 'nexmo'

const nexmo = new Nexmo({
    apiKey: "82e2aced",
    apiSecret: "BbtZo6cS5fPoOY76"
})
const PhoneService = {
    async sendSMS() {
        nexmo.message.sendSms("Nexmo", "84378988056", "Hello ae", {
            type: "unicode"
        }, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    }
}
export default PhoneService