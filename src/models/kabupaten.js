const _ = require('underscore')
const md5 = require('md5')

const Generator = require('../utils/generator')

class Kabupaten extends Generator {
  constructor () {
    super({ name: "kabupaten", file: "kabupaten.json", related: "provinsi", related_file: "provinsi.json" })
  }

  async parser (datas, type) {
    switch (type) {
      case 'master':
        let master = _.chain(datas.origin).map(data => {
          const hash = md5(`kab_${data.id}`)
          return {
            id: data.id,
            pid: data.prov_id,
            name: data.kab_kota,
            ibukota: data.ibukota,
            bsni: data.k_bsni,
            hash: hash
          }
        }).groupBy('pid').value()
        const legacyPromise = datas.origin.map(data => {
          const hash = md5(`ka_${data.id}`)

          return Promise.all([
            this.dir(`/provinsi/kabupaten/${data.id}`),
            this.generate(`find/${hash}.json`, {
              id: data.id,
              pid: data.prov_id,
              name: data.kab_kota,
              ibukota: data.ibukota,
              bsni: data.k_bsni,
              hash: hash
            })
          ])
        })

        const masterPromise = datas.related.map(data => {
          return this.generate(`provinsi/${data.id}/${this.name}.json`, master[`${data.id}`])
        })

        return Promise.all(masterPromise.concat(legacyPromise))
        break;
      default:
        break;
    }
  }

  async run () {
    const data = await this.loader()

    return Promise.all([
      this.parser(data,  "master")
    ])
  }
}

module.exports = new Kabupaten()
