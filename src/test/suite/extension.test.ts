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
        const fileContent = "Text {text: 'Hello world' }\n";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Format file successfully using absolute path', () => {
        const command = "/usr/bin/qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }\n";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Format file successfully using optional arguments', () => {
        const command = "qmlformat";
        const args: string[] = ["-n"];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }\n";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Format file with no line ending', () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
        });
    });

    test('Format empty file', () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "");
        });
    });

    test('Format empty file with blank spaces', () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = " \n\t\t\n\n  ";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "");
        });
    });

    test('Format file but output warning on stderr', () => {
        const command = "python3";
        const args: string[] = ["-c", "import sys; print('Warning', file=sys.stderr, end=''); print('Formatted')"];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return promise.then(result => {
            assert.equal(result, "Formatted\n");
        });
    });

    test('Error because temporary file not creatable', () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'this-folder-does-not-exists', 'test.qml');
        const fileContent = "Hello world;";

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return assert.rejects(promise, /^Formatting of 'test\.qml' aborted because file '[^']+' could not be created: '[\s\S]*?'.$/);
    });

    test('Error because invalid qml format', () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return assert.rejects(promise, /^Formatting of 'test\.qml' failed \([^)]+\): '[\s\S]*?'.$/);
    });

    test('Error because command does not exist', () => {
        const command = "this-command-does-not-exist";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return assert.rejects(promise, /^Formatting of 'test\.qml' failed \([^)]+\): '[\s\S]*?'.$/);
    });

    test('Error because command failed', () => {
        const command = "false";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Hello world;";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        return assert.rejects(promise, /^Formatting of 'test\.qml' failed \([^)]+\): '[\s\S]*?'.$/);
    });
});
