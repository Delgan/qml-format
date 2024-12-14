import * as vscode from 'vscode';
import { runQmlFormatter } from './formatter';


export function activate(context: vscode.ExtensionContext) {

	let logger = vscode.window.createOutputChannel("QML Formatter", { log: true });

	let loggerDisposable = new vscode.Disposable(() => {
		logger.dispose();
	});

	let registerDisposable = vscode.languages.registerDocumentFormattingEditProvider('qml', {

		async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
			// The formatting event is triggered before file is actually saved on disk. Ideally,
			// the formatter should accept a document content as stdin and format it to stdout.
			// However, "qmlformat" only accepts a file path as input, so we need to save the
			// document to a temporary file first.
			// This is actually the recommended workaround,
			// see https://github.com/microsoft/vscode/issues/90273

			const config = vscode.workspace.getConfiguration();
			const command = config.get<string>("qmlFormat.command")!;
			const args = config.get<string[]>("qmlFormat.extraArguments")!;
			const fileContent = document.getText();
			const filePath = document.fileName;

			logger.info(`Formatting file: '${filePath}'`);

			return runQmlFormatter(command, args, fileContent, filePath, logger).then((formatted) => {
				logger.debug("Formatting done.");
				const lastLineId = document.lineCount - 1;
				const fullRange = new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
				return [vscode.TextEdit.replace(fullRange, formatted)];
			}, error => {
				logger.error(error);
				vscode.window.showErrorMessage(error);
				return error;
			});
		},
	});

	logger.info("QML Formatter activated.");

	context.subscriptions.push(registerDisposable);
	context.subscriptions.push(loggerDisposable);
}
