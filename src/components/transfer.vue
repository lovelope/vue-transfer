<template>
  <div class="transfer" :style="{width: level === 1 ? '405px' : ( level === 2 ? '556px' : '707px')}">
    <div class="left">
      <div class="left-header">{{ leftHeader }}</div>
      <div class="left-content">
        <div class="list1">
          <div v-if="level === 1 && leftList.filter(item => !item[checkedName]).length > 0" class="list1-item" @click="handleClickAll">全部</div>
          <div
            v-for="(item1, idx1) in leftList.filter(item => !item[checkedName])"
            :key="idx1"
            :class="['list1-item', index1 === idx1 ? 'item-highlight' : '']"
            :data-idx1="idx1"
            @click="handleClickFirst"
          >
            {{ item1.label }}
          </div>
        </div>

        <div
          class="list2"
          v-if="leftList && leftList.length > 0 && leftList[index1].children && leftList[index1].children.length > 0"
        >
          <div v-if="level === 2 && leftList[index1].children.filter(item => !item[checkedName]).length > 0" class="list2-item" @click="handleClickAll">全部</div>
          <div
            v-for="(item2, idx2) in leftList[index1].children.filter(item => !item[checkedName])"
            :key="idx2"
            :class="['list2-item', index2 === idx2 ? 'item-highlight' : '']"
            :data-idx2="idx2"
            @click="handleClickSecond"
          >
            {{ item2.label }}
          </div>
        </div>

        <div
          class="list3"
          v-if="leftList && leftList.length > 0 && leftList[index1].children && leftList[index1].children.length > 0 && leftList[index1].children[index2].children && leftList[index1].children[index2].children.length > 0"
        >
          <div v-if="level === 3 && leftList[index1].children[index2].children.filter(item => !item[checkedName]).length > 0" class="list3-item" @click="handleClickAll">全部</div>
          <div
            v-for="(item3, idx3) in leftList[index1].children[index2].children.filter(item => !item[checkedName])"
            :key="idx3"
            :class="['list3-item', index3 === idx3 ? 'item-highlight' : '']"
            :data-idx3="idx3"
            @click="handleClickThird"
          >
            {{ item3.label }}
          </div>
        </div>
      </div>
    </div>

    <div class="between">
      <div class="arrow-right">&gt;</div>
      <div class="arrow-left">&lt;</div>
    </div>

    <div class="right">
      <div class="right-header">{{ rightHeader }}</div>
      <div class="right-content">
        <div class="list1">
          <div
            v-for="(item, idx) in rightList"
            :key="idx"
            class="list1-item"
            :data-idx="idx"
            @click="handleClickRight"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'transfer',
  data() {
    return {
      index1: 0,
      index2: 0,
      index3: 0
    }
  },
  props: {
    leftList: {
      required: true,
      type: Array
    },
    rightList: {
      required: true,
      type: Array
    },
    leftHeader: {
      required: true,
      type: String
    },
    rightHeader: {
      required: true,
      type: String
    },
    level: {
      required: false,
      type: Number,
      default: 1
    },
    checkedName: {
      required: false,
      type: String,
      default: 'checked'
    }
  },
  methods: {
    // 将值同步到父组件
    syncValue() {
      this.$emit('syncList', {
        leftList: this.leftList,
        rightList: this.rightList
      })
    },

    /**
     * 点击一级菜单
     * @param event
     */
    handleClickFirst(event) {
      this.index1 = parseInt(event.target.dataset.idx1, 10)
      if (this.level === 1) {
        const item = this.leftList.filter(item => !item[this.checkedName])[this.index1]
        item[this.checkedName] = true
        this.rightList.push(item)
      } else if (this.level === 2) {
        this.index2 = 0
      } else if (this.level === 3) {
        this.index2 = 0
        this.index3 = 0
      }
      this.syncValue()
    },

    /**
     * 点击二级菜单
     * @param event
     */
    handleClickSecond(event) {
      this.index2 = parseInt(event.target.dataset.idx2, 10)
      if (this.level === 2) {
        const item = this.leftList[this.index1].children.filter(item => !item[this.checkedName])[this.index2]
        item[this.checkedName] = true
        this.rightList.push(item)
      } else if (this.level === 3) {
        this.index3 = 0
      }
      this.syncValue()
    },

    /**
     * 点击三级菜单
     * @param event
     */
    handleClickThird(event) {
      this.index3 = parseInt(event.target.dataset.idx3, 10)
      if (this.level === 3) {
        const item = this.leftList[this.index1].children[this.index2].children.filter(item => !item[this.checkedName])[this.index3]
        item[this.checkedName] = true
        this.rightList.push(item)
      }
      this.syncValue()
    },

    /**
     * 点击右侧菜单
     * @param event
     */
    handleClickRight(event) {
      const index = parseInt(event.target.dataset.idx, 10) // 在右边列表的索引
      const rightItem = this.rightList[index] // 在右边列表的元素
      const level = this.level // 权限等级

      if (level === 1) {
        for (let i = 0; i < this.leftList.length; i++) {
          if (this.leftList[i].value === rightItem.value) {
            this.leftList[i][this.checkedName] = false
            this.rightList.splice(index, 1)
            this.syncValue()
            return
          }
        }
      } else if (level === 2) {
        const provinceCode = rightItem.value.substr(0, 2)
        for (let i = 0; i < this.leftList.length; i++) {
          if (this.leftList[i].value.substr(0, 2) === provinceCode) { // 相同省
            for (let j = 0; j < this.leftList[i].children.length; j++) {
              if (this.leftList[i].children[j].value === rightItem.value) {
                this.leftList[i].children[j][this.checkedName] = false
                this.rightList.splice(index, 1)
                this.syncValue()
                return
              }
            }
          }
        }
      } else if (level === 3) {
        const provinceCode = rightItem.value.substr(0, 2)
        const cityCode = rightItem.value.substr(0, 4)
        for (let i = 0; i < this.leftList.length; i++) {
          if (this.leftList[i].value.substr(0, 2) === provinceCode) { // 相同省
            for (let j = 0; j < this.leftList[i].children.length; j++) {
              if (this.leftList[i].children[j].value.substr(0, 4) === cityCode) {
                for (let k = 0; k < this.leftList[i].children[j].children.length; k++) {
                  if (this.leftList[i].children[j].children[k].value === rightItem.value) {
                    this.leftList[i].children[j].children[k][this.checkedName] = false
                    this.rightList.splice(index, 1)
                    this.syncValue()
                    return
                  }
                }
              }
            }
          }
        }
      } else {
        console.error('不允许撤销其他管理员分配的权限')
      }
    },

    /**
     * 将左边最低一级数据全部加到右边
     * @param event
     */
    handleClickAll(event) {
      const { level, index1, index2 } = this
      if (level === 1) {
        for (let i = 0; i < this.leftList.length; i++) {
          if (!this.leftList[i][this.checkedName]) { // 避免右侧列表出现重复项
            this.leftList[i][this.checkedName] = true
            this.rightList.push(this.leftList[i])
          }
        }
      } else if (level === 2) {
        for (let i = 0; i < this.leftList[index1].children.length; i++) {
          if (!this.leftList[index1].children[i][this.checkedName]) {
            this.leftList[index1].children[i][this.checkedName] = true
            this.rightList.push(this.leftList[index1].children[i])
          }
        }
      } else if (level === 3) {
        for (let i = 0; i < this.leftList[index1].children[index2].children.length; i++) {
          if (!this.leftList[index1].children[index2].children[i][this.checkedName]) {
            this.leftList[index1].children[index2].children[i][this.checkedName] = true
            this.rightList.push(this.leftList[index1].children[index2].children[i])
          }
        }
      } else {
        console.error('点击了错误的按钮')
      }

      this.syncValue()
    }
  }
}
</script>

<style lang="less" scoped>
.transfer {
  display: flex;
  justify-content: space-between;
  height: 300px;
  border-radius: 4px;

  .left-header,
  .right-header {
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .left-content,
  .right-content {
    display: flex;
    flex-direction: row;
    height: calc(100% - 40px);
  }

  .list1,
  .list2,
  .list3 {
    width: 150px;
    height: 100%;
    overflow: auto;
    border-right: 1px solid #ebeef5;
    border-radius: 4px;

    .list1-item,
    .list2-item,
    .list3-item {
      padding-left: 5px;
      color: #606266;
    }

    .list1-item:hover,
    .list2-item:hover,
    .list3-item:hover {
      color: #409eff;
    }

    .item-highlight {
      background: #ebeef5;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }

  .between {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100px;

    .arrow-right,
    .arrow-left {
      width: 100%;
      height: 60px;
      font-size: 20px;
      line-height: 60px;
      color: #606266;
      text-align: center;
    }
  }

  .right {
    width: 150px;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
}
</style>
