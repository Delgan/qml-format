import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/* Execute a command and return the stdout output as a string.

The command must accepts a file path as its last argument.
A temporary file containing `fileContent` will be created next to the file `filePath` to be formatted.
The result of the formatting command executed on this temporary file will be returned.
*/
export const runExternalFormatter = async (command: string, args: readonly string[], fileContent: string, filePath: string, tmpExtension: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        if (!fileContent.trim()) {
            return resolve("");
        }

        const randomString = Math.random().toString(36).substring(2, 10);
        const pathObject = path.parse(filePath);
        const fileName = pathObject.base;
        const tempFilePath = path.join(pathObject.dir, `${pathObject.name}-${randomString}-formatting-tmp.${tmpExtension}`);


        fs.access(tempFilePath, fs.constants.F_OK, (err) => {
            if (!err) {
                return reject(`Formatting of '${fileName}' aborted because file '${tempFilePath}' already exists.`);
            }
            fs.writeFile(tempFilePath, fileContent, (writeError) => {
                if (writeError) {
                    return reject(`Formatting of '${fileName}' aborted because file '${tempFilePath}' could not be created: '${writeError.message}'.`);
                }
                child_process.execFile(command, ["-i", tempFilePath].concat(args), (execError, execStdout, execStderr) => {
                    fs.readFile(tempFilePath, (readError, readData) => {
                        fs.unlink(tempFilePath, (unlinkError) => {
                            if (execError) {
                                return reject(`Formatting of '${fileName}' failed (${execError.code}): '${execError.message}'.`);
                            }
                            if (readError) {
                                return reject(`Formatting of '${fileName}' aborted because file '${tempFilePath}' could not be read: '${readError.message}'.`);
                            }
                            // For now, we ignore this because the formatter may emit warnings which must not cause a failure.
                            // It would probably be better to log it somehow.
                            // if (execStderr) {
                            //     return reject(`Formatting of '${fileName}' proceeded with an error: '${execStderr}'.`);
                            // }
                            if (unlinkError) {
                                return reject(`Formatting of '${fileName}' ended with an error because file '${tempFilePath}' could not be deleted: '${unlinkError.message}'.`);
                            }
                            return resolve(readData.toString('utf8'));
                        });
                    });

                });
            });
        });
    });
};
