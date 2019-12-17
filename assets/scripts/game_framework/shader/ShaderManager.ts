import ShaderLab from "./ShaderLab";
import ShaderMaterial from "./ShaderMaterial";
import BaseClass from "../base/BaseClass";

export enum ShaderType {
    Default = 0,
    Gray, //灰度
    GrayScaling,//灰度缩放
    Stone,//石化
    Ice,//冰霜
    Frozen,//冻结的
    Mirror,//镜子
    Poison,//毒药
    Banish,//放逐
    Vanish,//消失
    Invisible,//隐形的
    Blur,//模糊
    GaussBlur,//高斯模糊
    Dissolve,//溶解
    Fluxay,//流光
    FluxaySuper,
    Glowing,//发光的
    Mask,//遮罩
    Water,//水流
    length//shader数量。不可用于类型
}

export default class ShaderManager extends BaseClass{
    public useShader(sprite: cc.Sprite, shader): ShaderMaterial {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.log('Shader not surpport for canvas');
            return;
        }
        if (!sprite || !sprite.spriteFrame || sprite.getState() === shader) {
            return;
        }
        if (shader > ShaderType.Gray) {
            let name = ShaderType[shader];
            cc.log(" shader name ",name);
            let lab = ShaderLab[name];
            if (!lab) {
                cc.log('Shader not defined', name);
                return;
            }
            cc.dynamicAtlasManager.enabled = false;
            let material = new ShaderMaterial(name, lab.vert, lab.frag, lab.defines || []);
            let texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            material.updateHash();
            let sp = sprite as any;
            sp._material = material;
            sp._renderData._material = material;
            sp._state = shader;
            return material;
        }
        else {
            sprite.setState(shader);
        }
    }
}
