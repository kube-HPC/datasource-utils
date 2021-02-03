const { expect } = require('chai');
const fse = require('fs-extra');
const path = require('path');
const DvcClient = require('../lib/DvcClient');
const stubsDir = path.resolve(__dirname, 'stubs');
const tempDir = path.resolve(__dirname, '..', 'temp');

describe('updated dvc files', () => {
    before(async () => {
        const files = await fse.readdir(stubsDir);
        await fse.ensureDir(tempDir);
        await Promise.all(
            files.map(file =>
                fse.copyFile(
                    path.resolve(stubsDir, file),
                    path.resolve(tempDir, file)
                )
            )
        );
    });
    after(async () => {
        await fse.remove(tempDir);
    });

    it('should enrich a new dvc file', async () => {
        const client = new DvcClient(tempDir, null);
        const fileName = 'base.dvc';
        const currentContent = await client.loadDvcContent(fileName);
        await client.enrichMeta(fileName, currentContent, 'hkube', {
            test: 'ok',
        });
        const updatedContent = await client.loadDvcContent(fileName);
        expect(updatedContent.outs).to.eql(currentContent.outs);
        expect(updatedContent.meta).to.haveOwnProperty('hkube');
        const { meta } = updatedContent;
        expect(meta.hkube.hash).to.eq(currentContent.outs[0].md5);
        expect(meta.hkube.test).to.eq('ok');
    });
    it('should enrich an outdated dvc file', async () => {
        const client = new DvcClient(tempDir, null);
        const fileName = 'outdated.dvc';
        const currentContent = await client.loadDvcContent(fileName);
        await client.enrichMeta(fileName, currentContent, 'hkube', {
            test: 'ok',
        });
        const updatedContent = await client.loadDvcContent(fileName);
        const { meta } = updatedContent;
        expect(meta.hkube.hash).to.eq(currentContent.outs[0].md5);
        expect(meta.hkube.test).to.eq('ok');
        expect(meta).to.haveOwnProperty('other');
        expect(meta.other.shouldNotChange).to.be.true;
    });
});
