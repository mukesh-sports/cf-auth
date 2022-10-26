const AWS = require('aws-sdk');

const cloudFront = new AWS.CloudFront.Signer(
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
);

const generateCookie = (domain) => {
    const policy = JSON.stringify({
        Statement: [
            {
                Resource: `http*://${domain}/*`, // http* => http and https
                Condition: {
                    DateLessThan: {
                        'AWS:EpochTime':
                            Math.floor(new Date().getTime() / 1000) + 60 * 60 * 1, // Current Time in UTC + time in seconds, (60 * 60 * 1 = 1 hour)
                    },
                },
            },
        ],
    });

    const cookie = cloudFront.getSignedCookie({
        policy,
    });

    return cookie;
}

module.exports = {
    generateCookie
}