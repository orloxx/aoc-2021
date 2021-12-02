import fs from 'fs';
import './polyfills.js';

export default function read(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function(error, data) {
      if (error) reject(error);
      resolve(data.split('\n').filter((value) => !!value));
    });
  });
}
