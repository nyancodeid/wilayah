const fs = require('fs')
const path = require('path')

const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function query (query) {
  switch (query.type) {
    case "provinsi":
      if (query.where) {
        let { id, bsni } = query.where

        if (id) {
          const data = await readFile(path.join(__dirname, `../dist/data/prov_id_${id}_legacy.json`), 'utf-8')
          return { success: true, data: JSON.parse(data) }
        } else if (bsni) {
          const data = await readFile(path.join(__dirname, `../dist/data/prov_bsni_${bsni}_legacy.json`), 'utf-8')
          return { success: true, data: JSON.parse(data) }
        } 
      }  

      const data = await readFile(path.join(__dirname, `../dist/data/provinsi_master.json`), 'utf-8')
      return { success: true, data: JSON.parse(data) }
      break;
  
    default:
      break;
  }
}

async function test() {
  console.time("Test - Master")
  await query({ type: "provinsi" })
  console.timeEnd("Test - Master")

  console.time("Test - Where 1")
  await query({ type: "provinsi", where: { id: 1 } })
  console.timeEnd("Test - Where 1")

  console.time("Test - Where 2")
  query({ type: "provinsi", where: { bsni: 'id-ba' } })
  console.timeEnd("Test - Where 2")
}

test()
