const fs = require('fs-extra')
const path = require('path')
const util = require('util')

class Generator {
  constructor ({ name, file, related = false, related_file = false }) {
    this.name = name
    this.fileName = file
    this.related = related
    this.related_file = related_file
  } 

  async loader () {
    const data = {
      origin: await fs.readFile(path.join(__dirname, "../dirty/" + this.fileName), 'utf-8')
    }

    data.origin = JSON.parse(data.origin)

    if (this.related) {
      data.related = await fs.readFile(path.join(__dirname, "../dirty/" + this.related_file), 'utf-8')
      data.related = JSON.parse(data.related)
    }

    return data
  }

  generate (name, data) {
    return fs.writeJSON(path.join(__dirname, '../dist/' + name), data)
  }
  
  dir (dirPath) {
    return fs.mkdir(path.join(__dirname, '../dist/' + dirPath), { recursive: true })
  }
}

module.exports = Generator