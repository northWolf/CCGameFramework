/**
 * 路径相关的实用函数。
 */
import BaseClass from "../base/BaseClass";

export default class PathUtils extends BaseClass {

    /**
     * 获取规范的路径。
     */
    public getRegularPath(path: string): string {
        if (path == null) {
            return null;
        }
        return path.replace('\\', '/');
    }

    /**
     * 获取连接后的路径。
     */
    public getCombinePath(...path: string[]): string {
        if (path == null || path.length < 1) {
            return null;
        }

        var combinePath: string = path[0];
        for (var i = 1; i < path.length; i++) {
            combinePath = combinePath + "/" + path[i];
        }
        return this.getRegularPath(combinePath);
    }

    /**
     * 获取远程格式的路径（带有file:// 或 http:// 前缀）。
     */
    public getRemotePath(...path: string[]): string {
        var combinePath = this.getCombinePath(...path);
        if (combinePath == null) {
            return null;
        }

        var remotePath: string;
        if (combinePath.indexOf("://") != -1) {
            return combinePath;
        } else {
            return ("https:///" + combinePath).replace("https:////", "https:///");
        }
    }

    /**
     * 根据文件路径获取文件的完整名称
     */
    public getFileNameInPath(path: string): string {
        var inde: number = path.lastIndexOf("/")
        if (inde != -1) {
            return path.substr(inde + 1, path.length);
        }
        return path;
    }

    /**
     * 根据文件路径获取文件的后缀名
     */
    public getExtensionByFilePath(filePath: string): string {
        if (filePath.lastIndexOf('.') == -1)
            return null;

        return filePath.substr(filePath.lastIndexOf('.') + 1, filePath.length);
    }

    /**
     * 从带后缀名的文件名中提取出文件名
     */
    public getFileNameWithoutExtension(fileName: string) {
        return fileName.substr(0, fileName.lastIndexOf('.'));
    }

    /**
     * 通过路径获得最后一个文件夹的父路径
     */
    public getParentPathOfLastFoulder(path: string): string {
        for (var n = path.length - 1; 0 <= n; n--) {
            if (path[n] == '/' || path[n] == '\\')
                if (n != path.length - 1)
                    return path.substr(0, n);
        }
        return "";
    }
}