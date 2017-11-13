var azure = require('azure-storage');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

var blobSvc = azure.createBlobService(process.env.AZURE_CONNECTIONS_STRING);

const CONTAINER = 'site';
const SOURCE_DIR = path.resolve(__dirname, '..', process.argv[2]);

try {
  fs.accessSync(SOURCE_DIR);
} catch (e) {
  console.log('Source folder not accessible or does not exist:', SOURCE_DIR);
  process.exit(1);
}

function createContainerIfNotExists (container) {
  return new Promise((resolve, reject) => {
    blobSvc.createContainerIfNotExists(container, {
      publicAccessLevel: 'blob'
    }, (error, result, response) => error ? reject(error) : resolve(result));
  });
}

function listBlobs (container) {
  let entries = [];
  const list = (token, cb) => {
    blobSvc.listBlobsSegmented(container, token, (err, result) => {
      if (err) return cb(err);

      entries = entries.concat(result.entries);
      if (result.continuationToken !== null) {
        list(result.continuationToken, cb);
      } else {
        cb(null, entries);
      }
    });
  };

  return new Promise((resolve, reject) => {
    list(null, (err, res) => err ? reject(err) : resolve(res));
  });
}

function deleteBlobIfExists (container, blob) {
  return new Promise((resolve, reject) => {
    blobSvc.deleteBlobIfExists(container, blob, (err, res) => err ? reject(err) : resolve(res));
  });
}

function putBlobFromFile (container, blob, file) {
  return new Promise((resolve, reject) => {
    blobSvc.createBlockBlobFromLocalFile(container, blob, file, (err, res, response) => err ? reject(err) : resolve(res));
  });
}

// Put directory
function putDirectory (container, sourceDir, destDir) {
  let files = getLocalFilesInDir(sourceDir);
  return Promise.map(files, file => {
    // Need to remove the source dir portion from the filename.
    let newName = file.replace(sourceDir + '/', destDir);
    return putBlobFromFile(container, newName, file);
  }, { concurrency: 40 });
}

function getLocalFilesInDir (dir) {
  const files = fs.readdirSync(dir);

  return files.reduce((acc, file) => {
    let name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      acc = acc.concat(getLocalFilesInDir(name));
    } else {
      acc.push(name);
    }

    return acc;
  }, []);
}

createContainerIfNotExists(CONTAINER)
  .then(() => console.log('Cleaning up container'))
  .then(() => listBlobs(CONTAINER))
  .then(blobs => Promise.map(blobs, f => deleteBlobIfExists(CONTAINER, f.name), {concurrency: 40}))
  .then(() => console.log('Cleaning up container...done'))
  .then(() => console.log('Uploading files'))
  .then(() => putDirectory(CONTAINER, SOURCE_DIR, ''))
  .then(() => console.log('Uploading files...done'));
