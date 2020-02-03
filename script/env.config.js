// env is production or qa

const BASE_DOMAIN = {
    qa: 'https://qa-abc.com',
    production: 'https://abc.com'
};

module.exports = function (args) {
    const { qa, production } = args;
    if (qa) return BASE_DOMAIN['qa'];
    if (production) return BASE_DOMAIN['production'];
}