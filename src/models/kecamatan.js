const _ = require('underscore')
const md5 = require('md5')

const Generator = require('../utils/generator')

class Kecamatan extends Generator {
  constructor () {
    super({ name: "kecamatan", file: "kecamatan.json", related: "kabupaten", related_file: "kabupaten.json" })
  }

  async parser (datas, type) {
    switch (type) {
      case 'master':
        const master = _.chain(datas.origin).map(data => {
          const hash = md5(`kab_${data.id}`)
          return {
            id: data.id,
            kabid: data.kabkot_id,
            name: data.kec,
            hash: hash
          }
        }).groupBy('kabid').value()
        const legacyPromise = datas.origin.map(data => {
          const hash = md5(`kab_${data.id}`)
          return Promise.all([
            this.dir(`provinsi/kabupaten/kecamatan/${data.id}/`),
            this.generate(`find/${hash}.json`, {
              id: data.id,
              kabid: data.kabkot_id,
              name: data.kec,
              hash: hash
            })
          ])
        })

        const masterPromise = datas.related.map(data => {
          return this.generate(`provinsi/kabupaten/${data.id}/${this.name}.json`, master[`${data.id}`]);
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

module.exports = new Kecamatan()
