const childProcess = require('child_process');

const Shell = cwd => async (command, args) => {
    const cmd = childProcess.spawn(command, args, { cwd });
    return new Promise((res, rej) => {
        let cache = '';
        cmd.stdout.on('data', d => {
            cache += d.toString();
        });
        cmd.stderr.on('data', d => {
            cache += d.toString();
        });
        cmd.stdout.on('error', () => rej(cache));
        cmd.on('error', rej);
        cmd.on('exit', errorCode =>
            errorCode !== 0 ? rej(cache) : res(cache)
        );
    });
};

module.exports = Shell;
