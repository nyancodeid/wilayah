const _ = require('underscore')
const md5 = require('md5')
const pLimit = require('p-limit')
const Path = require('path')
const dotenv = require('dotenv')
const dotenvParseVariables = require('dotenv-parse-variables')
 
let env = dotenv.config({ path: Path.join(__dirname, '../../.env') })
    env = dotenvParseVariables(env.parsed)

const Generator = require('../utils/generator')

const limit = pLimit(1);

class Kelurahan extends Generator {
  constructor () {
    super({ name: "kelurahan", file: "kelurahan.json", related: "kecamatan", related_file: "kecamatan.json,kabupaten.json,provinsi.json" })
  }

  async parser (datas, type) {
    switch (type) {
      case 'master': {
        const limit = pLimit(env.CONCURRENCY_LIMIT);
        const master = _.chain(datas.origin).map(data => {
          const hash = md5(`kec_${data.id}`)
          return {
            id: data.id,
            kecid: data.kec_id,
            name: data.kelu,
            hash: hash
          }
        }).groupBy('kecid').value()
        const masterPromise = datas.related.kecamatan.map(data => {
          return limit(() => {
            return this.generate(
              `provinsi/kabupaten/kecamatan/${data.id}/${this.name}.json`, master[`${data.id}`]);
          })
        })

        return Promise.all(masterPromise)
      }
        
      case 'legacy': {
        const limit = pLimit(env.CONCURRENCY_LIMIT);

        const legacyPromise = datas.origin.map(data => {
          return limit(() => {
            const hash = md5(`kec_${data.id}`)
            const kecamatan = _.find(datas.related.kecamatan, { id: data.kec_id })
            const kabupaten = _.find(datas.related.kabupaten, { id: kecamatan.kabkot_id })
            const provinsi = _.find(datas.related.provinsi, { id: kabupaten.prov_id })

            return this.generate(`find/${hash}.json`, {
              id: data.id,
              kecid: data.kec_id,
              name: data.kelu,
              hash: hash,
              related: {
                kecamatan: {
                  id: data.kec_id,
                  nama: kecamatan.kec
                },
                kabupaten: {
                  id: kecamatan.kabkot_id,
                  nama: kabupaten.kab_kota,
                  ibukota: kabupaten.ibukota
                },
                provinsi: {
                  id: kabupaten.prov_id,
                  nama: provinsi.provinsi
                }
              }
            })
          })
        })

        return Promise.all(legacyPromise)
      }
      default:
        break;
    }
  }

  async run () {
    const data = await this.loader()

    return Promise.all([
      this.parser(data,  "master"),
      this.parser(data,  "legacy")
    ])
  }
}

module.exports = new Kelurahan()
