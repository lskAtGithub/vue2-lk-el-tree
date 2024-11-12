<template>
  <div class="--re-tree-wrapper">
    <div
      ref="inputBoxRef"
      class="--re-input"
      :class="{ focused: panelVisible }"
    >
      <input
        ref="inputRef"
        class="hide_input"
        @blur="onClose"
        @focus="onOpen"
        @click="onClosePanel"
      />
      <div class="value-wrapper">
        <div class="tags-content">
          <transition name="holderTransition">
            <span class="placeholder" v-show="!dynamicTags.length">
              {{ placeholder }}
            </span>
          </transition>
          <el-tag
            type="info"
            v-for="(tag, index) in dynamicTags"
            :key="index"
            size="small"
            closable
            @close="handleClose(tag)"
          >
            {{ tag[nodeAs.label] }}
          </el-tag>
          <el-tag
            type="info"
            v-show="showMergeTags && modelValue.length >= 2"
            size="small"
          >
            +{{ modelValue.length - 1 }}
          </el-tag>
        </div>
        <i
          class="--re-el-icon el-icon-arrow-down"
          :class="{ isOverturn: panelVisible }"
        />
      </div>
    </div>
    <transition name="fade">
      <div
        class="--re-panel-wrapper"
        v-show="panelVisible"
        :style="positionStyle"
        @mouseenter="judgePanelArea = true"
        @mouseleave="judgePanelArea = false"
      >
        <tree-panel
          ref="panelsRef"
          v-bind="$attrs"
          v-for="(item, index) in currentsRoot"
          :key="index"
          :options="item"
          :selected="modelValue"
          :nodeAlias="nodeAs"
          @clickItem="handleClickItem"
          @selectAll="handleSelectAll"
          @changeSelect="handleSelectChange"
        ></tree-panel>
      </div>
    </transition>
  </div>
</template>

<script>
import props from './props.js'
import TreePanel from './TreePanel.vue'
import { getLevel, getFlatSelectedTree } from './utils.js'

export default {
  name: 'ReTree',
  props,
  data() {
    return {
      currentsRoot: [],
      nodeAs: {
        label: 'label',
        value: 'value',
        children: 'children',
        disabled: 'disabled'
      },
      judgePanelArea: false,
      panelVisible: false,
      clickInputStatus: false,
      positionStyle: {}
    }
  },
  components: { TreePanel },
  watch: {
    options: {
      handler: function () {
        this.currentsRoot = [this.options] || []
      },
      immediate: true
    }
  },
  mounted() {
    this.nodeAs = Object.assign(this.nodeAs, this.nodeAlias)
  },
  computed: {
    modelValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    dynamicTags() {
      // 如果是折叠tag模式， 那么只显示一条tag和 +number
      if (this.showMergeTags) {
        return getFlatSelectedTree(this.options, [this.value[0]], this.nodeAs)
      }
      // 针对是否父子关联显示不同的数据
      if (!this.checkStrictly) {
        return getFlatSelectedTree(this.options, this.value, this.nodeAs)
      } else {
        return this.value
      }
    }
  },
  methods: {
    handleClickItem(item) {
      if (item[this.nodeAs.children] && item[this.nodeAs.children].length) {
        const level = getLevel(
          this.options,
          item[this.nodeAs.value],
          this.nodeAs
        )
        if (level + 1 <= this.currentsRoot.length) {
          this.currentsRoot.splice(level + 1)
        }
        this.currentsRoot.push(item[this.nodeAs.children])
        this.handleCalcPanelPosition()
      }
    },
    onOpen() {
      if (this.judgePanelArea) return
      this.panelVisible = true
      this.$refs.panelsRef.map((item) => item.openPenal())
      this.clickInputStatus = true
      setTimeout(() => {
        this.clickInputStatus = false
      }, 300)
      this.handleCalcPanelPosition()
    },
    onClose() {
      this.$nextTick(() => {
        if (this.judgePanelArea) {
          this.panelVisible = true
          this.$refs.panelsRef.map((item) => item.openPenal())
          this.$refs.inputRef.focus()
        } else {
          this.panelVisible = false
        }
      })
    },
    onClosePanel() {
      if (this.clickInputStatus) return
      if (this.panelVisible) {
        this.$refs.inputRef.blur()
      }
    },
    handleSelectAll(emitParams) {
      this.changeValue(emitParams)
      this.$emit('selectAll', emitParams)
    },
    handleSelectChange(emitParams) {
      this.changeValue(emitParams)
      this.$emit('changeSelect', emitParams)
    },
    // 计算面板需要出现的位置,尽量靠下和靠左打开, 除非距离实现是不够才考虑靠右靠上
    handleCalcPanelPosition() {
      const inputRect = this.$refs.inputBoxRef.getBoundingClientRect()
      const position = { left: 0, top: `${inputRect.height + 4}px` }
      if (window.innerHeight - inputRect.bottom < 240) {
        delete position.top
        position.bottom = `${inputRect.height + 4}px`
      }
      if (inputRect.right > window.innerWidth * 0.5) {
        delete position.left
        position.right = `6px`
      }
      this.positionStyle = position
    },
    // 修改value值， 参数归一， 对象统一为 check 和 value， 即本次勾选还是不勾选 & 操作的数据
    changeValue({ check, value }) {
      // 不关联模式下操作全选仅需要考虑值变成，不需要考虑children值
      let operationArr = this.modelValue || []
      if (!this.checkStrictly) {
        if (check) {
          value.map((item) => {
            operationArr.push(item[this.nodeAs.value])
          })
        } else {
          value.map((item) => {
            const index = this.value.indexOf(item[this.nodeAs.value])
            if (index != -1) {
              operationArr.splice(index, 1)
            }
          })
        }
      }
      this.modelValue = operationArr
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
@keyframes fadeOut {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(0);
  }
}

@keyframes holder {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.holderTransition-enter-active {
  animation: holder 1000ms cubic-bezier(0.2, 0.1, 0.1, 1);
}

.fade-enter-active,
.fade-leave-active {
  animation: fadeIn 100ms cubic-bezier(0.2, 0.1, 0.1, 1);
}
.fade-enter,
.fade-leave-to {
  animation: fadeOut 100ms cubic-bezier(0.2, 0.1, 0.1, 1);
}

@import './style.css';
</style>
