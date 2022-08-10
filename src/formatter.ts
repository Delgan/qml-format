import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/* Execute a command and return the stdout output as a string.

The command must accepts a file path as its last argument.
A temporary file containing `fileContent` will be created next to the file `filePath` to be formatted.
The result of the formatting command executed on this temporary file will be returned.
*/
export const runExternalFormatter = async (command: string, args: readonly string[], fileContent: string, filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const randomString = Math.random().toString(36).substring(2, 10);
        const tempFilePath = `${filePath}.formatting-${randomString}.tmp`;
        const fileName = path.basename(filePath);

        fs.access(tempFilePath, fs.constants.F_OK, (err) => {
            if (!err) {
                return reject(`Temporary file already existing and will not be overwritten: '${tempFilePath}'`);
            }
            fs.writeFile(tempFilePath, fileContent, async (writeError) => {
                if (writeError) {
                    return reject(`Error while creating temporary file '${tempFilePath}': '${writeError.message}'`);
                }
                child_process.execFile(command, args.concat(tempFilePath), (execError, execStdout, execStderr) => {
                    fs.unlink(tempFilePath, (unlinkError) => {
                        if (execError) {
                            return reject(`Formatting of '${fileName}' failed (${execError.code}): '${execError.message}'`);
                        }
                        if (execStderr) {
                            return reject(`Formatting of '${fileName}' proceeded with an error: '${execStderr}'`);
                        }
                        if (unlinkError) {
                            return reject(`Error while deleting temporary file '${tempFilePath}': '${unlinkError.message}'`);
                        }
                        return resolve(execStdout);
                    });
                });
            });
        });
    });
};
