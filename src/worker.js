const _ = require('underscore')
const md5 = require('md5')

const Generator = require('./generator')

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

class Ibukota extends Generator {
  constructor () {
    super({ name: "ibukota", file: "kabupaten.json", related: "provinsi", related_file: "provinsi.json" })
  }

  async parser (datas, type) {
    switch (type) {
      case 'master':
        const master = _.chain(datas.origin).map(data => {
          const hash = md5(`kab_${data.id}`)
          return {
            id: data.id,
            pid: data.prov_id,
            name: data.ibukota,
            bsni: data.k_bsni,
            hash: hash 
          }
        }).groupBy('pid').value()
        const legacyPromise = datas.origin.map(data => {
          const hash = md5(`i_${data.id}`)
          return Promise.all([
            this.dir(`provinsi/kabupaten/${data.id}/`),
            this.generate(`find/${hash}.json`, {
              id: data.id,
              pid: data.prov_id,
              name: data.ibukota,
              bsni: data.k_bsni,
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

class Kelurahan extends Generator {
  constructor () {
    super({ name: "kelurahan", file: "kelurahan.json", related: "kecamatan", related_file: "kecamatan.json" })
  }

  async parser (datas, type) {
    switch (type) {
      case 'master':
        const master = _.chain(datas.origin).map(data => {
          const hash = md5(`kec_${data.id}`)
          return {
            id: data.id,
            kecid: data.kec_id,
            name: data.kelu,
            hash: hash
          }
        }).groupBy('kecid').value()
        const legacyPromise = datas.origin.map(data => {
          const hash = md5(`kec_${data.id}`)
          return Promise.all([
            this.generate(`find/${hash}.json`, {
              id: data.id,
              kecid: data.kec_id,
              name: data.kelu,
              hash: hash
            })
          ])
        })

        const masterPromise = datas.related.map(data => {
          return this.generate(`provinsi/kabupaten/kecamatan/${data.id}/${this.name}.json`, master[`${data.id}`]);
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

module.exports = {
  provinsi: new Provinsi(),
  kabupaten: new Kabupaten(),
  ibukota: new Ibukota(),
  kecamatan: new Kecamatan(),
  kelurahan: new Kelurahan()
}