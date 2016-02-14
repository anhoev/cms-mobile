import * as fsModule from "file-system";

export function toFile(destinationFilePath:string, content:any) {
    const data = android.util.Base64.decode(content, android.util.Base64.DEFAULT);
    var fs:typeof fsModule = require("file-system");
    var stream:java.io.FileOutputStream;
    try {
        var javaFile = new java.io.File(destinationFilePath);
        stream = new java.io.FileOutputStream(javaFile);
        stream.write(data);
        return fs.File.fromPath(destinationFilePath);
    }
    catch (exception) {
        throw new Error(`Cannot save file with path: ${destinationFilePath}.`);
    }
    finally {
        if (stream) {
            stream.close();
        }
    }
}
