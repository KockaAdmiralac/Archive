function Sprite_ReffectBase() { this.initialize.apply(this, arguments); };
Sprite_ReffectBase.prototype = Onject.create(Sprite.prototype);
Sprite_ReffectBase.prototype.constructor = Sprite_ReffectBase;

Sprite_ReffectBase.prototype.initialize = function()
{
    Sprite.prototype.initialize.call(this);
    
};


function Sprite_ReffectDiffusion() {  this.initialize.apply(this, arguments); };

Sprite_ReffectDiffusion.prototype = Object.create(Sprite_ReffectBase.prototype);
Sprite_ReffectDiffusion.prototype.constructor = Sprite_ReffectDiffusion;