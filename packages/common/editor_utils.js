var fs = require('fs');

createDirectory =  function(_path) {
	if(fs.existsSync(_path))
		return;

    if (fs.existsSync(getParentDirectoryPath(_path))) {
        fs.mkdirSync(_path);
    } else {
        createDirectory(getParentDirectoryPath(_path));
        fs.mkdirSync(_path);
    }
}

getParentDirectoryPath = function (_path) {
    var tempPath = _path;
    for (var n = tempPath.length - 1; 0 <= n; n--) {
        if (tempPath[n] == '/' || tempPath[n] == '\\')
            if (n != tempPath.length - 1)
                return tempPath.substr(0, n);
    }
    return "";
}