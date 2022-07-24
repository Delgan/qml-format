import * as assert from 'assert';
import * as fs from 'fs';
import * as mocha from 'mocha';
import * as path from 'path';

import { runExternalFormatter } from '../../formatter';

suite('QmlFormat Extension Test Suite', () => {

    var tempDir: string;

    mocha.beforeEach(() => {
        tempDir = fs.mkdtempSync("qml-format-tests-");
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

    mocha.afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

});
