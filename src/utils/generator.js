const fs = require('fs-extra')
const path = require('path')
const dotenv = require('dotenv')
const dotenvParseVariables = require('dotenv-parse-variables')
 
let env = dotenv.config({ path: path.join(__dirname, '../../.env') })
    env = dotenvParseVariables(env.parsed)

const {default: PQueue} = require('p-queue')

const queue = new PQueue({concurrency: env.CONCURRENCY_LIMIT_QUEUE})

const DIRTY_SOURCE = {
  "kabupaten.json": fs.readJSONSync(path.join(__dirname, "../../dirty/kabupaten.json"), 'utf-8'),
  "kecamatan.json": fs.readJSONSync(path.join(__dirname, "../../dirty/kecamatan.json"), 'utf-8'),
  "kelurahan.json": fs.readJSONSync(path.join(__dirname, "../../dirty/kelurahan.json"), 'utf-8'),
  "provinsi.json": fs.readJSONSync(path.join(__dirname, "../../dirty/provinsi.json"), 'utf-8')
}

class Generator {
  constructor ({ name, file, related = false, related_file = false }) {
    this.name = name
    this.fileName = file
    this.related = related
    this.related_file = related_file
  } 

  async loader () {
    const data = {
      origin: DIRTY_SOURCE[this.fileName]
    }

    if (this.related) {
      if (this.related_file.includes(',')) {
        const relateds = this.related_file.split(',')
        data.related = {}

        for (const relate of relateds) {
          const item = relate.replace('.json', '')

          data.related[item] = DIRTY_SOURCE[relate]
        }

        return data
      }

      data.related = DIRTY_SOURCE[this.related_file]
    }

    return data
  }

  generate (name, data) {
    return queue.add(() => 
      fs.writeJSON(path.join(__dirname, '../../dist/' + name), data), {
        priority: 1
      });
  }
  
  dir (dirPath) {
    return queue.add(() => 
      fs.mkdir(path.join(__dirname, '../../dist/' + dirPath), { recursive: true }), {
        priority: 99
      })
  }
}

// let count = 0;
// queue.on('active', () => {
//   console.log(`Working on item #${++count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
// });

module.exports = Generator