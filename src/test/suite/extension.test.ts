import * as assert from 'assert';
import * as fs from 'fs';
import * as mocha from 'mocha';
import * as os from 'os';
import * as path from 'path';

import { runExternalFormatter } from '../../formatter';

suite('QmlFormat Extension Test Suite', () => {

    const tempDir: string = path.join(os.tmpdir(), "qml-format-tests");

    mocha.beforeEach(() => {
        fs.mkdirSync(tempDir);
    });

    mocha.afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('Format file successfully using executable', async () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }\n";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
    });

    test('Format file successfully using absolute path', async () => {
        const command = "/usr/bin/qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }\n";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
    });

    test('Format file successfully using optional arguments', async () => {
        const command = "qmlformat";
        const args: string[] = ["-n"];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }\n";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
    });

    test('Format file with no line ending', async () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
    });

    test('Format empty file', async () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "");
    });

    test('Format empty file with blank spaces', async () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = " \n\t\t\n\n  ";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "");
    });

    test('Format very big file', async () => {
        const command = "qmlformat";
        const args: string[] = [];
        const filePath = path.join(tempDir, 'test.qml');
        const text = ".".repeat(10 * 1024 * 1024);
        const fileContent = `Text {text: '${text}' }\n`;

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, `Text {\n    text: '${text}'\n}\n`);
    });

    test('Format file but output data on stderr', async () => {
        const command = "qmlformat";
        const args: string[] = ["--verbose"];
        const filePath = path.join(tempDir, 'test.qml');
        const fileContent = "Text {text: 'Hello world' }";

        fs.writeFileSync(filePath, fileContent);

        const promise = runExternalFormatter(command, args, fileContent, filePath, "qml");
        const result = await promise;
        assert.equal(result, "Text {\n    text: 'Hello world'\n}\n");
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
