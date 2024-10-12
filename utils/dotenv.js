import fs from 'node:fs'
import path from 'node:path'

const dirname = import.meta.dirname
const envpath = path.join(dirname, '..', '.env')

export const getEnv = () => {
  return new Promise((resolve, reject) => {
    const env = {}
    fs.readFile(envpath, 'utf8', (err, data) => {
      if (err) throw err;

      if (data.length === 0) {
        console.log('.env is empty');
      }

      // Parse .env
      let lines = data.split('\n');

      lines.forEach(line => {
        line = line.replace('\r', '').replace(' ', '');
        if (line.startsWith('#') || line.length === 0) {
          return
        }

        let [key, value] = line.split('=');

        env[key] = value;
      });

      resolve(env);
    });
  })
}