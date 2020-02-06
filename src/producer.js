const util = require('util')
const Path = require('path')
const rimraf = require('rimraf')

const rm = util.promisify(rimraf)

const Worker = require('./worker')

async function start () {
  await rm(Path.join(__dirname, '../dist/provinsi'))
  await rm(Path.join(__dirname, '../dist/provinsi.json'))


  console.time("producer-time")
  try {
    await Worker.provinsi.run()
    await Worker.kabupaten.run()
    await Worker.ibukota.run()
    await Worker.kecamatan.run()
    await Worker.kelurahan.run()
  } catch (err) {
    console.error(err)
    console.error("[Error] worker stoped")
  } finally {
    console.info("[Done] worker done")
    console.timeEnd("producer-time")
  }
}

start()