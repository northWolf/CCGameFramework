
export default class SDKLockState {

    //是否有返回大厅按钮，只有嵌入到app中时才会为true。
    private haveHome: boolean = false;

    //是否可以修改名称
    private editName: boolean = false;

    setHaveHome(flag){
        this.haveHome = flag;
    }

    isHaveHome(){
        return this.haveHome;
    }

    setEditName(flag){
        this.editName = flag;
    }

    canEditName(){
        return this.editName;
    }

    
    



}
