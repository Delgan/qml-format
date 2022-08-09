import * as assert from 'assert';
import * as fs from 'fs';
import * as mocha from 'mocha';
import * as path from 'path';
import * as os from 'os';

import { runExternalFormatter } from '../../formatter';

suite('QmlFormat Extension Test Suite', () => {

    const tempDir: string = path.join(os.tmpdir(), "qml-format-tests");

    mocha.beforeEach(() => {
        fs.mkdirSync(tempDir);
    });

    mocha.afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('Format file successfully', () => {
        // TODO: Configure the dev environment so that "qmlformat" command is installed and usable.
        const command = "cat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        return runExternalFormatter(command, args, fileContent, filePath).then(result => {
            assert.equal(result, fileContent);
        });
    });

    test('Error because command does not exist', () => {
        const command = "this-command-does-not-exist";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        assert.rejects(runExternalFormatter(command, args, fileContent, filePath));
    });
});
