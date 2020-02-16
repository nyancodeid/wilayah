const util = require('util')
const Path = require('path')
const fs = require('fs-extra')
const rimraf = require('rimraf')
const env = require('dotenv').config({ path: Path.join(__dirname, '../.env') })

const rm = util.promisify(rimraf)
const ora = require('ora');

const Worker = require('./models')

async function start () {
  const spinner = ora('Cleaning dist folder').start();
  console.time("Cleaning")
  await rm(Path.join(__dirname, '../dist/find'))
  await rm(Path.join(__dirname, '../dist/provinsi'))
  await rm(Path.join(__dirname, '../dist/provinsi.json'))

  fs.mkdirSync(Path.join(__dirname, '../dist/find'))
  fs.mkdirSync(Path.join(__dirname, '../dist/provinsi'))
  console.log("")
  console.timeEnd("Cleaning")
  spinner.stop()
  
  console.time("Generate JSON")
  try {
    await Worker.provinsi.run()
    await Worker.kabupaten.run()
    await Worker.ibukota.run()
    await Worker.kecamatan.run()
    await Worker.kelurahan.run()
  } catch (err) {
    console.error(err)
  } finally {
    console.timeEnd("Generate JSON")
    console.info("[Done] worker done")
  }
}

start()