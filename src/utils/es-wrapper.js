// const elasticsearch = require('elasticsearch')
const httpAwsEs = require('http-aws-es')
const { Client: Client6 } = require('es6');

module.exports = (hosts, apiKey, testMode, options) => {
  const esParams = { hosts }
  // Because we use ordinary elasticsearch container instead of AWS elasticsearch for integration tests
  if (!testMode) esParams.connectionClass = httpAwsEs
  console.log('esPArams', esParams);
  console.log('hosts', hosts);
  // const es = new elasticsearch.Client({ ...esParams, ...options })
  const es = new Client6({
    node: esParams,
    headers: {
      Authorization: `ApiKey ${apiKey}`,
    },
    // ssl
  });
  return {
    index: ({ index, type, id, body, refresh }) => new Promise((resolve, reject) => {
      es.index({ index, type, id, body, refresh, timeout: '5m' }, (error, response) => {
        if (error) reject(error)
        resolve(response)
      })
    }),
    remove: ({ index, type, id, refresh }) => new Promise((resolve, reject) => {
      es.delete({ index, type, id, refresh }, (error, response) => {
        if (error) reject(error)
        resolve(response)
      })
    }),
    exists: ({ index, type, id, refresh }) => new Promise((resolve, reject) => {
      es.exists({ index, type, id, refresh }, (error, response) => {
        if (error) reject(error)
        resolve(response)
      })
    }),
    indicesDelete: (index = '_all') => new Promise((resolve, reject) => {
      es.indices.delete({ index }, (error, response) => {
        if (error) reject(error)
        resolve(response)
      })
    })
  }
}
