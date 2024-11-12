<template>
  <div class="wrapper">
    <div>
      <p>树形选择</p>
      <p>
        <re-tree
          v-model="treeValue"
          :options="originData"
          :nodeAlias="{ label: 'name', value: 'id', children: 'children' }"
        ></re-tree>
      </p>
    </div>

    <div class="right">
      <p>树形选择</p>
      <p>
        <re-tree
          v-model="treeValue"
          :options="originData"
          :nodeAlias="{ label: 'name', value: 'id', children: 'children' }"
        ></re-tree>
<!-- 
        <el-cascader
          :options="originData"
          :props="{ multiple: true, label: 'name', value: 'id' }"
          collapse-tags
          clearable
        ></el-cascader> -->
      </p>
    </div>
  </div>
</template>

<script>
import ReTree from '../components/ReTree/index'
import { originData } from './data.js'

export default {
  name: 'HomePage',
  components: { ReTree },
  data() {
    return {
      originData: [],
      treeValue: [],
      treeValue1: ['111']
    }
  },
  mounted() {
    setTimeout(() => {
      this.originData = originData
    }, 1000)
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  padding: 180px 240px;
}

.right {
}
</style>
