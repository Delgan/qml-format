import * as vscode from 'vscode';
import { runExternalFormatter } from './formatter';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "qml-format" is now active!');

	let disposable = vscode.languages.registerDocumentFormattingEditProvider('qml', {

		async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
			// The formatting event is triggered before file is actually saved on disk. Ideally,
			// the formatter should accept a document content as stdin and format it to stdout.
			// However, "qmlformat" only accepts a file path as input, so we need to save the
			// document to a temporary file first.
			// This is actually the recommended workaround,
			// see https://github.com/microsoft/vscode/issues/90273

			// TODO: Command and arguments should be configurable.
			const command = "qmlformat";
			const args: string[] = [];
			const fileContent = document.getText();
			const filePath = document.fileName;

			return runExternalFormatter(command, args, fileContent, filePath).then((formatted) => {
				const lastLineId = document.lineCount - 1;
				const fullRange = new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
				return [vscode.TextEdit.replace(fullRange, formatted)];
			}, error => {
				vscode.window.showErrorMessage(error);
				return error;
			});
		},
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
