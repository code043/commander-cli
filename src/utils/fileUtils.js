import fs from 'fs';

export const getJsn = (path) => {
  const data = fs.existsSync(path) ? fs.readFileSync(path) : [];
  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const saveJsn = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
