import https from 'https';
import fs from 'fs';

export const download = (url: string, destination: string) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(destination);

  https.get(url, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close(resolve);
    });
  }).on('error', error => {
    fs.unlink(destination, () => {});

    reject(error.message);
  });
});