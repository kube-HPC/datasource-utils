const fse = require('fs-extra');
const DvcClient = require('./DvcClient');

class Repository {
    constructor(repositoryName, rootDir) {
        this.repositoryName = repositoryName;
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
        return `${this.rootDir}/${this.repositoryName}`;
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

    async push(commitMessage) {
        await this.dvc.push();
        await this.gitClient.add('.');
        const { commit } = await this.gitClient.commit(commitMessage);
        await this.gitClient.push();
        return commit;
    }
}

module.exports = Repository;
