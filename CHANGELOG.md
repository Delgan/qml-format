# Change Log

## 1.1.0

- Add new "QML Format" output channel in VS Code to access logs of the extension.

## 1.0.4

- Fix duplicated new lines when using `windows` newline mode ([#2](https://github.com/Delgan/qml-format/issues/2)).
- Fix error while formatting file bigger than ~1 MB.

## 1.0.3

- Fix possible warnings outputed by `qmlformat` reported as errors in VS Code.
- Fix formatting error of files identifed in VSCode as "QML" but without ".qml" extension.

## 1.0.2

- Fix formatting error on recent versions of `qmlformat` ([#1](https://github.com/Delgan/qml-format/issues/1)).
- Fix error when formatting an empty file.

## 1.0.1

- Fix Changelog not updated in Marketplace.

## 1.0.0

- Add `"qmlFormat.command"` settings to optionally configure `qmlformat` executable path.
- Add `"qmlFormat.extraArguments"` settings to optionally use additional formatting arguments.

## 0.1.1

- Loosen minimum VS Code version requirement.

## 0.1.0

- Initial release
