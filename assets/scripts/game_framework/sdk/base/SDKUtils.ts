
export default class SDKUtils{


    static getURL(){
        if(window && window.location){
           return  window.location.href;
        }
        return null;
    }


    static getUrlParm(tag:string){
        let url = this.getURL();
        if(url){
            let array: string[] = SDKUtils.getParamList(url); 
            let value = this.getValueByTag(tag,array);  
            return value;
        }else{
            return null;
        }
    }


    public constructor() {
	}
    
    /**
     * 
     * @param tag 
     * @param url 
     */
	public static getValueByUrl(tag:string,url:string){
        let array: string[] = this.getParamList(url);
        return this.getValueByTag(tag,array);
    }
    
    /**
     * 
     * @param tag 
     * @param array 
     */
    static getValueByTag(tag: string,array: string[]) {
        for(var i = 0;i < array.length;i++) {
            let value: string = array[i];
            let index = value.indexOf(tag);
            if(index >= 0) {
                let index = value.indexOf(tag);//获取临时token
                return value.substring(index + tag.length + 1);
            }
        }
        return null;
    }   
    
    /**
     * 
     * @param url 
     */
    static getParamList(url:string): string[]{
        if(url){
            let index = url.indexOf("?");
            let str = url.substring(index+1);
            if(str.length > 0){
                return str.split("&");
            }
        }

        return [];
    }
    /**
     * 
     * @param url 
     * @param obj 
     */
    public static getUrlByObj(url:string,obj:Object){
        let temp=url;
        let i=0;
        for(let key in obj) {
            let value=obj[key];
            // console.log("value is " + obj[key]+"  key "+key);
            if(value) {
                temp += (i == 0 ? "" : "&") + key + "="+value;
            } else {
                temp += (i == 0 ? "" : "&") + key + "=";
            }    
            i++;
        }
        return temp;
    }
/**
     * 设置cookie
     * @param name cookie的名称
     * @param value cookie的值
     * @param day cookie的过期时间
     */
    static setCookie(name, value, day) {
        if(day !== 0){     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
          var expires = day * 24 * 60 * 60 * 1000;
          var date = new Date(+new Date()+expires);
          document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
        }else{
          document.cookie = name + "=" + escape(value);
        }
      };

/**
     * 获取对应名称的cookie
     * @param name cookie的名称
     * @returns {null} 不存在时，返回null
     */
    static getCookie(name) {
        var arr;
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return unescape(arr[2]);
        else
          return null;
      };      
}
