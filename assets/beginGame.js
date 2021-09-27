// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


/**
 * 
 * 要求。转盘启动后 每个数字依次顺时针被点亮为红色， 
 * 速度从每秒点亮20个数字（设定最高频率为20个/秒），
 * 持续1-3秒，逐步（中间频率自定义，每个频率的持续时间都是1-3秒之间，
 * 总频率数不得少于5个频率）降低到每秒点亮2个数字，并等待2秒后，
 * 落到最终设定的停止的位置的数字上，并显示为绿色。 
 *  转盘停止转动时 所有格子内的数字都要同时变成100。
 */

cc.Class({
    extends: cc.Component,

    properties: {

        editBox: cc.EditBox,
        beginBtn: cc.Button,
        itemList: [cc.Node],


        //已知条件
        //最终目标
        _toNun: number = -1,
        _curChoosIdx: number = -1, //当前选中
        _maxP: number = 20, //最快速率
        _minP: number = 2,
        _totalP: number = 3, //频率区间频率数
        _maxTime: number = 3,
        _minTime: number = 1,
        _minGear: number = 5,

        //过程中数据
        _countList: [] = [], //每个阶段的步数列表
        _pList: [] = [],
        _beginCount: boolean = false,

        _oldTime: number = -1,
        _curTime: number = -1,
        _curIndex: number = -1,
        _curNum: number = -1,
        _idx: number = -1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.beginBtn.node.on('click', this.callback, this);
    },

    callback(evt) {
        let editTex = this.editBox.string;
        if (this._beginCount === true) {
            return;
        }
        if (editTex >= 1 && editTex <= 16) {
            //todo
            this._toNun = editTex;
            this.startTurn();
            this.resetUpdata();
            this._beginCount = true;
        } else {

            //
            this.editBox.string = '重输'
        }

    },

    resetUpdata() {
        for (let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].getComponent("item").updateTextDescTo(i + 1);
            this.itemList[i].getComponent("item").updateTextColor(new cc.color(0, 0, 0, 255));
        }
        this._curIndex = 0;
        this._curTime = this._oldTime = 0;
        this._curNum = this._countList[0];
        this._idx = 0;
    },

    startTurn() {

        let minList = this._pList = this.getList();
        let totalNum = 0;
        this._countList = [];
        for (let i = 1; i <= minList.length - 1; i++) {
            let time = Math.random() * (this._maxTime - this._minTime) + this._minTime;
            let num = Math.floor(time * minList[i]);
            this._countList.push(num);
            totalNum += num;
        }
        let num = totalNum % this.itemList.length;
        let time = Math.random() * (this._maxTime - this._minTime) + this._minTime;
        let num1 = this._toNun - num + Math.floor((this._maxP * time) / this.itemList.length) * this.itemList.length;
        this._countList = [num1].concat(this._countList);
    },

    getList() {
        let minList = [this._maxP];
        let dis = Math.floor((this._maxP - this._minP) / this._totalP);
        for (let i = 0; i < this._totalP; i++) {
            minList.push(this._maxP - i * dis - Math.ceil(Math.random() * dis));
        }
        minList.push(this._minP);
        return minList;
    },

    start() {

        // todo

    },

    update(dt) {
        if (!this._beginCount) {
            return;
        }

        let time = 0;
        this._curTime += dt;

        if (this._curNum <= 0) {
            if (this._curIndex >= this._countList.length - 1) {
                // 结束
                for (let i = 0; i < this.itemList.length; i++) {
                    this.itemList[i].getComponent("item").updateTextDescTo("100");
                    this.itemList[this._toNun - 1].getComponent("item").updateTextColor(new cc.color(0, 255, 0, 255));
                    this._beginCount = false;
                }
            } else {
                this._curIndex++;
                this._curNum = this._countList[this._curIndex];
            }
        } else {
            let timedis = 1 / this._pList[this._curIndex];
            if (this._curTime - this._oldTime >= timedis) {
                // 
                this._oldTime += timedis;
                this._curNum--;
                let id = this._idx % this.itemList.length;
                for (let i = 0; i < this.itemList.length; i++) {
                    this.itemList[i].getComponent("item").updateTextColor(i === id ? new cc.color(255, 0, 0, 255) : new cc.color(0, 0, 0, 255));
                }

                this._idx++;
                console.log(this._curNum);
            }

        }
    },
});
