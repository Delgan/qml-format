import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Format a given filecontent using the "qmlformat" command.
 *
 * A temporary file containing `fileContent` will be created next to the file `filePath` to be formatted.
 * The file will be formatted in-place by "qmlformat", then read back to obtain the final string returned.
 *
 * @param command The executable to run "qmlformat".
 * @param args Optional additional command line arguments passed to "qmlformat".
 * @param fileContent The content of the file to be formatted.
 * @param filePath The path of the file to be formatted.
 * @returns A Promise with the formatted string, or an error message if formatting failed.
 */
export const runQmlFormatter = async (command: string, args: readonly string[], fileContent: string, filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        if (!fileContent.trim()) {
            return resolve("");
        }

        const randomString = Math.random().toString(36).substring(2, 10);
        const pathObject = path.parse(filePath);
        const fileName = pathObject.base;
        // The file must ends with ".qml" otherwise "qmlformat" will output an error.
        const tempFilePath = path.join(pathObject.dir, `${pathObject.name}-${randomString}-formatting-tmp.qml`);


        fs.access(tempFilePath, fs.constants.F_OK, (err) => {
            if (!err) {
                return reject(`Formatting of '${fileName}' aborted because file '${tempFilePath}' already exists.`);
            }
            fs.writeFile(tempFilePath, fileContent, { "encoding": "utf8" }, (writeError) => {
                if (writeError) {
                    return reject(`Formatting of '${fileName}' aborted because file '${tempFilePath}' could not be created: '${writeError.message}'.`);
                }
                // We must format the file in-place and not rely on stdout.
                // For one thing, "\n" outputed by "qmlformat" would be transformed to "\r\n" on Windows, which causes problems with "NewlineType=windows" option.
                // Secondly, the "execFile" buffer size is limited (~1MB by default), so it's not reliable enough to use it.
                child_process.execFile(command, ["-i", tempFilePath].concat(args), (execError, _execStdout, _execStderr) => {
                    fs.readFile(tempFilePath, { "encoding": "utf8" }, (readError, readData) => {
                        fs.unlink(tempFilePath, (unlinkError) => {
                            // The "execStdout" and "execStderr" are ignored for now (because they should not cause a failure).
                            // It would probably be better to log them somehow.
                            if (execError) {
                                return reject(`Formatting of '${fileName}' failed (${execError.code}): '${execError.message}'.`);
                            }
                            if (readError) {
                                return reject(`Formatting of '${fileName}' aborted because file '${tempFilePath}' could not be read: '${readError.message}'.`);
                            }
                            if (unlinkError) {
                                return reject(`Formatting of '${fileName}' ended with an error because file '${tempFilePath}' could not be deleted: '${unlinkError.message}'.`);
                            }
                            return resolve(readData);
                        });
                    });

                });
            });
        });
    });
};
