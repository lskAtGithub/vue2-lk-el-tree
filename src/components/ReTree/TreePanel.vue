<template>
  <div class="--re-panel-item-wrapper">
    <div class="--re-panel-item" v-if="checkAll" :key="checkoutAllValue">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkoutAllValue"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
    </div>
    <div
      class="--re-panel-item"
      :class="{ active: currentItem === index }"
      v-for="(item, index) in options"
      :key="getBooleanValue(item) + '&&' + index"
    >
      <el-checkbox
        :disabled="item[nodeAlias.disabled]"
        :key="item[nodeAlias.value]"
        :checked="getBooleanValue(item)"
        @change="(e) => handleCheckChange(e, item)"
      ></el-checkbox>
      <span class="--re-panel-item--label" @click="handleClickItem(item, index)"
        >{{ item[nodeAlias.label] }}
      </span>
      <i
        v-if="hasChildren(item)"
        class="el-icon-arrow-right"
        @click="handleClickItem(item, index)"
      ></i>
    </div>
  </div>
</template>

<script>
import allProps from './props.js'

// eslint-disable-next-line
const { value, ...props } = allProps

export default {
  name: 'tree-panel',
  props: {
    ...props,
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isIndeterminate: false,
      checkoutAllValue: false,
      currentItem: ''
    }
  },
  watch: {
    options: {
      handler: function () {
        let checkAll = true
        this.isIndeterminate = false
        for (let index = 0; index < this.options.length; index++) {
          if (
            this.selected.includes(this.options[index][this.nodeAlias.value])
          ) {
            this.isIndeterminate = true
          } else {
            checkAll = false
          }
        }
        if (checkAll) this.isIndeterminate = false
        this.checkoutAllValue = checkAll
      }
    }
  },
  methods: {
    openPenal() {
      let checkAll = true
      this.options.map((item) => {
        if (this.selected.includes(item[this.nodeAlias.value])) {
          this.isIndeterminate = true
        }
        if (!this.selected.includes(item[this.nodeAlias.value])) {
          checkAll = false
        }
      })
      if (checkAll) this.isIndeterminate = false
      this.checkoutAllValue = checkAll
    },
    getBooleanValue(item) {
      return this.selected.includes(item[this.nodeAlias.value])
    },
    hasChildren(item) {
      return (
        item &&
        item[this.nodeAlias.children] &&
        item[this.nodeAlias.children].length
      )
    },
    handleCheckChange(val, item) {
      if (val) {
        this.isIndeterminate = true
        this.$nextTick(() => {
          let selectAll = true
          this.options.map((item) => {
            if (!this.selected.includes(item[this.nodeAlias.value])) {
              selectAll = false
            }
          })
          this.checkoutAllValue = selectAll
          this.isIndeterminate = !selectAll
        })
      } else {
        this.$nextTick(() => {
          this.isIndeterminate = false
          this.checkoutAllValue = false
          for (let index = 0; index < this.options.length; index++) {
            if (
              this.selected.includes(this.options[index][this.nodeAlias.value])
            ) {
              this.isIndeterminate = true
              break
            }
          }
        })
      }
      this.$emit('changeSelect', { check: val, value: [item] })
    },
    handleCheckAllChange(value) {
      this.isIndeterminate = false
      const choiceArr = []
      this.options.map((item) => {
        choiceArr.push(item)
      })
      this.$emit('selectAll', { check: value, value: choiceArr })
    },
    handleClickItem(item, index) {
      this.currentItem = index
      this.$emit('clickItem', item)
    }
  }
}
</script>

<style scoped>
.--re-panel-item-wrapper {
  border: 1px solid #e4e7ed;
  min-width: 210px;
  height: 240px;
  max-height: 240px;
  overflow-y: auto;
  background-color: #fff;
}

.--re-panel-item-wrapper .--re-panel-item {
  padding: 12px 16px;
  cursor: pointer;
  text-align: left;
  color: #606266;
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.--re-panel-item-wrapper .--re-panel-item.active {
  color: #017cf9;
}

.--re-panel-item-wrapper .--re-panel-item:hover {
  background-color: #f5f7fa;
}

.--re-panel-item-wrapper .--re-panel-item .--re-panel-item--label {
  flex: 1;
}
</style>
