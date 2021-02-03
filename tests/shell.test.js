const { expect } = require('chai');
const Shell = require('./../lib/Shell');
const fse = require('fs-extra');
const path = require('path');

describe('Shell', () => {
    it('should execute ls command', async () => {
        const shell = Shell(__dirname);
        const stubsDir = path.resolve(__dirname, 'stubs');
        const files = await fse.readdir(stubsDir);
        const output = await shell('ls', ['./stubs/']);
        const splittedOutput = output.split('\n').filter(item => item);
        expect(splittedOutput).to.eql(files);
    });
});
