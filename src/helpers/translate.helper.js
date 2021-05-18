const qs = require("qs");
const axios = require("axios");
const libreTranslateApi = process.env.LIBRE_TRANSLATE_API;
const key = process.env.LIBRE_TRANSLATE_API_KEY;

module.exports = {
    async translate(text, source, target) {
        const params = {
            api_key: key,
            q: text,
            source: source,
            target: target
        };
      
        const url = `${libreTranslateApi}/translate`;
        const data = qs.stringify(params);
              
        const response = await axios({
            method: "POST",
            url: url,
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        });

        if (data.error) {
            throw new Error();
        }

        return response.data.translatedText;
    }
}