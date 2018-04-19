const AWS = require("aws-sdk");
const https = require("https");
const webhook = process.env.CHIMEWEBHOOK.split('/').slice(-1);
exports.handler = (event, context, callback) => {
              console.log(event);
              if (parseFloat(event.detail.severity) > parseFloat(process.env.SEVERITY)) {
                              const req = https.request({
                                                method: 'POST',
                                                hostname: 'hooks.chime.aws',
                                                path: `/incomingwebhooks/${webhook}`,
                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                  }
                                              }, res => {
                                                callback(null, 'success');
                                              });
                              req.on('error', e => {
                                                callback(`Error: ${e.message}`);
                                              });
                              req.write(JSON.stringify({
                                                Content: `${event.detail.accountId} ${event.region} : ${event.detail.title} https://console.aws.amazon.com/guardduty/home?region=${event.region}#/findings?search=id%3D${event.detail.id}`
                                              }));
                              req.end();
                            }
              callback(null, event.detail.title);
            };

