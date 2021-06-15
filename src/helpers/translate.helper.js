const translate = require('translation-google');

module.exports = {
    async translate(text, _, to) {
        const translation = await translate(text, { to: to });

        return translation;
    }
}