import App from "../App";

export default class Log {

    private static getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }

    private static stack(index): string {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach(function (line) {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({[lineBreak[0]]: lineBreak[1]});
            }
        });

        var list = [];
        if (index < result.length - 1) {
            for (var a in result[index]) {
                list.push(a);
            }
        }

        var splitList = list[0].split(".");
        if(splitList[0] == "Function")
        {
            return (splitList[1] + "." + splitList[2] + ": ");
        }
        else
        {
            return (splitList[0] + "." + splitList[1] + ": ");
        }
    }

    /**
     * 打印
     * @param args 内容
     */
    public static info(...args): void {
        if (App.DebugUtils.isDebug) {
            var backLog = console.log || cc.log;
            backLog.call(this, Log.getDateString(), Log.stack(2), cc.js.formatStr.apply(cc, arguments));
        }
    }

    /**
     * 警告
     * @param args 内容
     */
    public static warn(...args) {
        if (App.DebugUtils.isDebug) {
            var backLog = console.log || cc.log;
            backLog.call(this, "[WARN]", Log.getDateString(), Log.stack(2), cc.js.formatStr.apply(cc, arguments));
        }
    }

    /**
     * 错误
     * @param args 内容
     */
    public static error(...args) {
        if (App.DebugUtils.isDebug) {
            var backLog = console.log || cc.log;
            backLog.call(this, "[ERROR]", Log.getDateString(), Log.stack(2), cc.js.formatStr.apply(cc, arguments));
        }
    }

    /**
     *  打印堆栈
     * @param args 内容
     */
    public static trace(...args): void {
        if (App.DebugUtils.isDebug) {
            var backLog = console.log || cc.log;
            var e = new Error();
            var lines = e.stack.split("\n");
            lines.shift();
            var result = [];
            lines.forEach(function (line) {
                backLog.call(this, line);
            });
        }
    }
}