import fs from 'fs'
import path from 'path'
import './polyfills.js'

const [, dirPath] = process.argv
const day = path.basename(dirPath)

export default function read(filename) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join('./days', day, filename)

    fs.readFile(fullPath, 'utf8', function (error, data) {
      if (error) reject(error)
      const list = data.split('\n')
      list.splice(list.length - 1)
      resolve(list)
    })
  })
}
