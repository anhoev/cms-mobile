import * as fsModule from "file-system";

export function toFile(destinationFilePath:string, content:any) {
    const data = data = NSData.alloc().initWithBase64EncodedStringOptions(content, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
    var fs:typeof fsModule = require("file-system");

    if (data instanceof NSData) {
        data.writeToFileAtomically(destinationFilePath, true);
        return fs.File.fromPath(destinationFilePath);
    } else {
        reject(new Error(`Cannot save file with path: ${destinationFilePath}.`));
    }
}
