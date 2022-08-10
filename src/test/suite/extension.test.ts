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

    test('Format file successfully using executable', () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Format file successfully using absolute path', () => {
        const command = "/opt/qt515/bin/qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Format file successfully using optional arguments', () => {
        const command = "qmlformat";
        const args: string[] = ["-n"];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Error because temporary file not creatable', () => {
        const command = "this-command-does-not-exist";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'this-folder-does-not-exists', 'test.qml');
        const fileContent = "Hello world;";

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return assert.rejects(promise, /^Formatting of 'test\.qml' aborted because file '[^']+' could not be created: '[\s\S]*?'.$/);
    });

    test('Error because command does not exist', () => {
        const command = "this-command-does-not-exist";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return assert.rejects(promise, /^Formatting of 'test\.qml' failed \([^)]+\): '[\s\S]*?'.$/);
    });

    test('Error because command failed', () => {
        const command = "false";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return assert.rejects(promise, /^Formatting of 'test\.qml' failed \([^)]+\): '[\s\S]*?'.$/);
    });

    test('Error outputed by the command', () => {
        const command = "python3";
        const args: string[] = ["-c", "import sys; print('Failure', file=sys.stderr, end='')"];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath);
        return assert.rejects(promise, /^Formatting of 'test.qml' proceeded with an error: 'Failure'.$/);
    });
});
