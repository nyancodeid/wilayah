const _ = require('underscore')
const md5 = require('md5')

const Generator = require('../utils/generator')

class Provinsi extends Generator {
  constructor () {
    super({ name: "provinsi", file: "provinsi.json" })
  }

  async parser (datas, type) {
    switch (type) {
      case 'master':
        const hash = md5(`p_master`)
        const master = datas.origin.map(data => {
          return {
            id: data.id,
            name: data.provinsi,
            bsni: data.bsni,
            hash: md5(`p_${data.id}`)
          }
        })

        await this.dir(`provinsi`)
        await this.generate(`find/${hash}.json`, master)

        return this.generate(`${this.name}.json`, master)
        break;

      case 'legacy':
        const legacyTask = datas.origin.map(data => {
          const hash = md5(`p_${data.id}`)

          return Promise.all([
            this.dir(`provinsi/${data.id}`),
            this.generate(`provinsi/${data.id}.json`, {
              id: data.id,
              name: data.provinsi,
              bsni: data.p_bsni,
              hash: md5(`p_${data.id}`)
            }),
            this.generate(`find/${hash}.json`, {
              id: data.id,
              name: data.provinsi,
              bsni: data.p_bsni,
              hash: md5(`p_${data.id}`)
            })
          ])
        })

        await this.dir(`find`)

        return Promise.all(legacyTask)
        break;
    
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

module.exports = new Provinsi()