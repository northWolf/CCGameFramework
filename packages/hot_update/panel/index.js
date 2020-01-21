'use strict';

/** 模块引用 */
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

window.packageRoot = "packages://hot_update";

const copy = Editor.require(window.packageRoot + "/core/copy.js"),
    FileUtil = Editor.require(window.packageRoot + "/core/FileUtil.js");


// 版本配置
var config = {};

// 输入参数
var args = {};
args.versionInBuiltModuleId = "inbuilt";                                                                                // 初始版本打包进去的玩法编号
args.projectVersionInargsPath = path.join(Editor.Project.path, "assets/resources/version/");                        // 项目初始热更配置文件路径

/*----------------------------------------------------------------------------------------------------*/

// 生成包内热更配置
var VersionInitial = function (moduleName, version, mPaths) {
    var mPaths = mPaths;

    var projectName = moduleName + "_project.manifest.json";
    var versionName = moduleName + "_version.manifest.json";

    var data = {
        server: args.server,
        remoteManifest: projectName,
        remoteVersion: versionName,
        version: version,
        assets: {},
        searchPaths: []
    }

    /**  处理配置信息 */
    this.process = function () {
        this.traversal(path.join(args.releasePath, 'res'), data.assets, moduleName);

        if (moduleName == "common")
            this.traversal(path.join(args.releasePath, 'src'), data.assets);

        var projectManifest = path.join(args.projectVersionInargsPath, projectName);
        FileUtil.createDirectory(args.projectVersionInargsPath);

        var releaseManifest = path.join(args.releaseVersionInargsPath, projectName);

        // 生成配置配置文件
        fs.writeFile(projectManifest, JSON.stringify(data), (err) => {
            if (err) throw err;
            // Editor.log("生成初始热更配置文件 : " + projectName);
        });

        // 拷贝到发布目录
        copyDir(projectManifest, releaseManifest, function (err) {
            if (err) Editor.log("【资源打包】生成初始热更配置文件出错 : \r\n" + path.resolve(releaseManifest));
            else {
                Editor.log("【资源打包】生成初始热更配置文件到发布目录 : " + projectName);
            }
        });
    }

    /**
     * 遍历文件和目录
     * @param folder(string) 目录
     * @param data(object) 数据
     * @param moduleName(string)   模块名
     */
    this.traversal = function (folder, data, moduleName) {
        var stat = fs.statSync(folder);
        if (!stat.isDirectory()) {
            return;
        }

        var mPath = "resources/modules/" + moduleName + "/";       // 模块路径
        var subpaths = fs.readdirSync(folder), subpath, md5, relative;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(folder, subpaths[i]);
            Editor.log("subpath = " + subpath);
            stat = fs.statSync(subpath);

            if (stat.isDirectory()) {
                this.traversal(subpath, data, moduleName);
            } else if (stat.isFile()) {
                md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'utf8')).digest('hex');
                relative = path.relative(args.releasePath, subpath);
                relative = relative.replace(/\\/g, '/');

                if (relative.indexOf("src/") > -1) {
                    data[relative] = {'md5': md5};
                } else if (relative.indexOf("res/") > -1) {
                    if (moduleName.indexOf("inbuilt") == -1 && relative.indexOf(mPath) > -1 && moduleName == args.versionInBuiltModuleId) {         // 不为主模块
                        data[relative] = {'md5': md5};
                    } else if (moduleName.indexOf("common") > -1 &&
                        (relative.indexOf(mPath) > -1 || relative.indexOf("/import/") > -1 || relative.indexOf("/raw-internal/") > -1)) {
                        data[relative] = {'md5': md5};
                    }
                }
            }
        }
    }
}

// 发布包内版本配置文件
function releaseVersionInitial() {
    // 找到目标模块目录下的所有文件
    var mPaths = [];        // 模块名
    var mVersions = [];        // 版本号
    for (var moduleNmae in config.modules) {
        mPaths.push(moduleNmae);
        mVersions.push(config.modules[moduleNmae].initial);
    }

    // 生成不同模块的更新配置文件
    for (var i = 0; i < mPaths.length; i++) {
        var vi = new VersionInitial(mPaths[i], mVersions[i], mPaths);
        vi.process();
    }
}

/*----------------------------------------------------------------------------------------------------*/

// 生成CDN热更配置
var VersionCdn = function (moduleName, version) {
    var projectName = moduleName + "_project.manifest.json";
    var versionName = moduleName + "_version.manifest.json";

    var data = {
        server: args.server,
        remoteManifest: projectName,
        remoteVersion: versionName,
        version: version,
        assets: {},
        searchPaths: []
    }

    /**  处理配置信息 */
    this.process = function () {
        this.traversal(path.join(args.releasePath, 'res'), data.assets, moduleName);

        if (moduleName == "inbuilt")
            this.traversal(path.join(args.releasePath, 'src'), data.assets);

        var projectProjectManifest = path.join(args.releaseCdnPath, projectName);

        // 生成配置配置文件 project.manifest
        fs.writeFile(projectProjectManifest, JSON.stringify(data), (err) => {
            if (err) throw err;
            // Editor.log("【资源打包】生成ＣＤＮ更配置文件 : " + projectName);
        });

        var projectVersionManifest = path.join(args.releaseCdnPath, versionName);

        delete data.assets;
        delete data.searchPaths;

        // 生成配置配置文件 version.manifest
        fs.writeFile(projectVersionManifest, JSON.stringify(data), (err) => {
            if (err) throw err;
            // Editor.log("【资源打包】生成ＣＤＮ更配置文件 : " + versionName);
        });
    }

    /**
     * 避难遍历文件和目录
     * @param folder(string) 目录
     * @param data(object) 数据
     * @param moduleName(string)   模块名
     */
    this.traversal = function (folder, data, moduleName) {
        var stat = fs.statSync(folder);
        if (!stat.isDirectory()) {
            return;
        }

        var mPath = "resources/modules/" + moduleName + "/";       // 模块路径
        var subpaths = fs.readdirSync(folder), subpath, md5, relative;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(folder, subpaths[i]);
            stat = fs.statSync(subpath);

            if (stat.isDirectory()) {
                this.traversal(subpath, data, moduleName);
            } else if (stat.isFile()) {
                md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'utf8')).digest('hex');
                relative = path.relative(args.releasePath, subpath);
                relative = relative.replace(/\\/g, '/');

                if (relative.indexOf("src/") > -1) {
                    data[relative] = {'md5': md5};
                } else if (relative.indexOf("res/") > -1) {
                    if (moduleName.indexOf("inbuilt") == -1 && relative.indexOf(mPath) > -1) {         // 不为主模块
                        data[relative] = {'md5': md5};
                    } else if (moduleName.indexOf("common") > -1 &&
                        (relative.indexOf(mPath) > -1 || relative.indexOf("/import/") > -1 || relative.indexOf("/raw-internal/") > -1)) {
                        data[relative] = {'md5': md5};
                    }
                }
            }
        }
    }
}

// 发布ＣＤＮ版本更新资源
function releaseVersionCdn() {
    var mPaths = [];        // 模块名
    var mVersions = [];        // 版本号
    var playData = {};        // 玩法版本信息
    playData.line = config.line;
    playData.modules = {};
    for (var moduleNmae in config.modules) {
        mPaths.push(moduleNmae);
        mVersions.push(config.modules[moduleNmae].current);

        playData.modules[moduleNmae] = config.modules[moduleNmae].current;
    }

    // 生成ＣＤＮ所有版本配置文件
    if (config.isUpdateVersion) {
        fs.writeFile(args.releaseVersionConfigPath, JSON.stringify(playData), (err) => {
            if (err) throw err;
            Editor.log("【资源打包】生成ＣＤＮ所有版本配置文件完成");
        });
    }

    // 生成不同模块的更新配置文件
    for (var i = 0; i < mPaths.length; i++) {
        var vc = new VersionCdn(mPaths[i], mVersions[i]);
        vc.process();
    }

    /** 删除文件夹 */
    function deleteFolderRecursive(path) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
        }
    };

    deleteFolderRecursive(path.resolve(args.releaseCdnPath + "src"))
    deleteFolderRecursive(path.resolve(args.releaseCdnPath + "res"))

    copyDir(path.resolve(args.releasePath + "src"), path.resolve(args.releaseCdnPath + "src"), function (err) {
        if (err) Editor.log("【资源打包】发布到ＣＮＤ的 src 目录出错");
        else Editor.log("【资源打包】发布到ＣＮＤ的 src 目录完成")
    });

    copyDir(path.resolve(args.releasePath + "res"), path.resolve(args.releaseCdnPath + "res"), function (err) {
        if (err) Editor.log("【资源打包】发布到ＣＮＤ的 res 目录出错");
        else Editor.log("【资源打包】发布到ＣＮＤ的 res 目录完成");
    });
}


/*----------------------------------------------------------------------------------------------------*/

Editor.Panel.extend({
    // style: fs.readFileSync(Editor.url(window.packageRoot + "/panel/index.css", "utf8")) + "",
    // template: fs.readFileSync(Editor.url(window.packageRoot + "/panel/index.html", "utf8")) + "",
    ready() {
        readProjectModuleVersionInfo();
        readProjectBuilderInfo();
        releaseVersionInitial();
        releaseVersionCdn();
    },
});

function readProjectModuleVersionInfo() {
    var data = fs.readFileSync(path.join(Editor.Project.path, "assets/resources/config/project_module_version.json"), 'utf-8');
    var modules_version_info = JSON.parse(data);
    config = modules_version_info;
    args.server = config.server;
}

function readProjectBuilderInfo() {
    var data = fs.readFileSync(path.join(Editor.Project.path, "local/builder.json"), 'utf-8');
    var builderInfo = JSON.parse(data);
    args.releasePath = path.join(Editor.Project.path, "build/", builderInfo.platform, "/");  // 发布资源文件路径
    args.releaseVersionInargsPath = path.join(args.releasePath, "res/raw-assets/resources/version/");                 // 发布初始热更配置文件路径
    args.releaseCdnPath = path.join(Editor.Project.path, "build-update/", builderInfo.platform, "/", config.line, "/");   // 发布到ＣＮＤ路径
    args.releaseVersionConfigPath = path.join(Editor.Project.path, "build-update/", builderInfo.platform, "/", config.line, "/version.json");         // 发布的所有模块版本信息

    var realPath = path.join(args.releaseCdnPath);
    Editor.log("【资源打包】发布资源文件路径 " + realPath);
    FileUtil.createDirectory(realPath);
}

