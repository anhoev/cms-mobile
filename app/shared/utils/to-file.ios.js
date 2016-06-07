"use strict";
function toFile(destinationFilePath, content) {
    var data = data = NSData.alloc().initWithBase64EncodedStringOptions(content, NSDataBase64DecodingOptions.NSDataBase64DecodingIgnoreUnknownCharacters);
    var fs = require("file-system");
    if (data instanceof NSData) {
        data.writeToFileAtomically(destinationFilePath, true);
        return fs.File.fromPath(destinationFilePath);
    }
    else {
        reject(new Error("Cannot save file with path: " + destinationFilePath + "."));
    }
}
exports.toFile = toFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tZmlsZS5pb3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0by1maWxlLmlvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsZ0JBQXVCLG1CQUEwQixFQUFFLE9BQVc7SUFDMUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUN4SixJQUFJLEVBQUUsR0FBbUIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRWhELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsaUNBQStCLG1CQUFtQixNQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7QUFDTCxDQUFDO0FBVmUsY0FBTSxTQVVyQixDQUFBIn0=