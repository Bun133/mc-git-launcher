const makeDir = require('make-dir');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const axios = require('axios');
const adapter = require('axios/lib/adapters/http');
const fss = require('fs').promises;
const zlib = require('zlib');
const tar  = require('tar');
const progress = require('fs-readstream-progress');

const JAVA_MANIFEST_URL = 'https://cdn.assets-gdevs.com/openjdk8.json';

class JavaSetup extends EventEmitter {

  constructor({ userData }) {
    super();
    this.userData = userData;
    this.tempFolder = path.join(this.userData, 'temp');
  }


  convertOSToJavaFormat(ElectronFormat) {
    switch (ElectronFormat) {
      case 'win32':
        return 'windows';
      case 'darwin':
        return 'mac';
      case 'linux':
        return 'linux';
      default:
        return false;
    }
  }

  async getJavaManifest() {
    const url = JAVA_MANIFEST_URL;
    return axios.get(url);
  }

  async downloadFile(fileName, url, onProgress) {
    await makeDir(path.dirname(fileName));

    const { data, headers } = await axios.get(url, {
      responseType: 'stream',
      responseEncoding: null,
      adapter
    });
    const out = fss.createWriteStream(fileName, { encoding: null });
    data.pipe(out);

    // Save variable to know progress
    let receivedBytes = 0;
    const totalBytes = parseInt(headers['content-length'], 10);

    data.on('data', chunk => {
      // Update the received bytes
      receivedBytes += chunk.length;
      if (onProgress) {
        onProgress(((receivedBytes * 100) / totalBytes).toFixed(1));
      }
    });

    return new Promise((resolve, reject) => {
      data.on('end', () => {
        out.end();
        resolve();
      });

      data.on('error', () => {
        reject();
      });
    });
  }

  async installJava() {
    const javaManifest = (await this.getJavaManifest()).data;
    const javaOs = this.convertOSToJavaFormat(process.platform);
    const javaMeta = javaManifest.find(v => v.os === javaOs);
    const {
      version_data: { openjdk_version: version },
      binary_link: url,
      release_name: releaseName
    } = javaMeta;
    const javaBaseFolder = path.join(this.userData, 'java');
    await fss.remove(javaBaseFolder);
    const downloadLocation = path.join(this.tempFolder, path.basename(url));

    await this.downloadFile(downloadLocation, url, p => {
      ipcRenderer.invoke('update-progress-bar', parseInt(p, 10) / 100);
      setDownloadPercentage(parseInt(p, 10));
    });

    ipcRenderer.invoke('update-progress-bar', -1);
    setDownloadPercentage(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const totalSteps = process.platform !== 'win32' ? 2 : 1;

    setCurrentStep(`Extracting 1 / ${totalSteps}`);

    const gunzip    = zlib.createGunzip();
    const extractor = tar.extract({path: this.tempFolder});
    const firstExtraction = progress(downloadLocation).pipe(gunzip).pipe(extractor);

    await new Promise((resolve, reject) => {
      firstExtraction.on('progress', ({ percent }) => {
        ipcRenderer.invoke('update-progress-bar', percent);
        setDownloadPercentage(percent);
      });
      firstExtraction.on('end', () => {
        resolve();
      });
      firstExtraction.on('error', err => {
        reject(err);
      });
    });

    await fss.remove(downloadLocation);

    // If NOT windows then tar.gz instead of zip, so we need to extract 2 times.
    if (process.platform !== 'win32') {
      ipcRenderer.invoke('update-progress-bar', -1);
      setDownloadPercentage(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentStep(`Extracting 2 / ${totalSteps}`);
      const tempTarName = path.join(
        this.tempFolder,
        path.basename(url).replace('.tar.gz', '.tar')
      );
      const secondExtraction = extractFull(tempTarName, this.tempFolder, {
        $bin: sevenZipPath,
        $progress: true
      });
      await new Promise((resolve, reject) => {
        secondExtraction.on('progress', ({ percent }) => {
          ipcRenderer.invoke('update-progress-bar', percent);
          setDownloadPercentage(percent);
        });
        secondExtraction.on('end', () => {
          resolve();
        });
        secondExtraction.on('error', err => {
          reject(err);
        });
      });
      await fss.remove(tempTarName);
    }

    const directoryToMove =
      process.platform === 'darwin'
        ? path.join(this.tempFolder, `${releaseName}-jre`, 'Contents', 'Home')
        : path.join(this.tempFolder, `${releaseName}-jre`);
    await fss.move(directoryToMove, path.join(javaBaseFolder, version));

    await fss.remove(path.join(this.tempFolder, `${releaseName}-jre`));

    const ext = process.platform === 'win32' ? '.exe' : '';

    if (process.platform !== 'win32') {
      const execPath = path.join(javaBaseFolder, version, 'bin', `java${ext}`);

      await promisify(exec)(`chmod +x "${execPath}"`);
      await promisify(exec)(`chmod 755 "${execPath}"`);
    }

    dispatch(updateJavaPath(null));
    setCurrentStep(`Java is ready!`);
    ipcRenderer.invoke('update-progress-bar', -1);
    setDownloadPercentage(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch(closeModal());
  }
}
