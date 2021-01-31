const fse = require('fs-extra');
const DvcClient = require('./DvcClient');

class Repository {
    constructor(repositoryName, rootDir, dirName) {
        this.repositoryName = repositoryName;
        this.dirName = dirName || repositoryName;
        this.rootDir = rootDir;
        this.dvc = new DvcClient(this.cwd);
        /** @type {import('simple-git').SimpleGit} */
        this.gitClient = null;
    }

    /** @returns {Promise<{ repositoryName: string }>} */
    static async readHkubeFile(cwd) {
        const hkubeFilePath = `${cwd}/.dvc/hkube`;
        const hasHkubeFile = await fse.pathExists(hkubeFilePath);
        if (!hasHkubeFile) {
            throw new Error('missing hkube file in .dvc directory');
        }
        const stringifiedHkubeFile = await fse.readFile(hkubeFilePath);
        return JSON.parse(stringifiedHkubeFile.toString('utf-8'));
    }

    get cwd() {
        return `${this.rootDir}/${this.dirName}`;
    }

    getLog() {
        return this.gitClient.log();
    }

    createHkubeFile() {
        const content = { repositoryName: this.repositoryName };
        return fse.writeFile(
            `${this.cwd}/.dvc/hkube`,
            JSON.stringify(content, null, 2)
        );
    }

    /** @type {(filePaths: string[]) => Promise<void>} */
    pullFiles(filePaths) {
        return this.dvc.pull(filePaths);
    }

    async deleteClone() {
        return fse.remove(this.cwd);
    }

    async commit(commitMessage) {
        await this.gitClient.add('.');
        const { commit } = await this.gitClient.commit(commitMessage);
        return commit;
    }

    async push() {
        await this.dvc.push();
        return this.gitClient.push();
    }
}

module.exports = Repository;
