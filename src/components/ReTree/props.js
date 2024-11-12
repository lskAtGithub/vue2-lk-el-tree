export default {
  // 双向绑定
  value: {
    type: Array,
    default: []
  },
  // 数据源
  options: {
    type: Array,
    default: []
  },
  // placeholder
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 数据源别名
  nodeAlias: {
    type: Object,
    default: {}
  },
  // 是否开启全选
  checkAll: {
    type: Boolean,
    default: true
  },
  // 是否开启父子关联
  checkStrictly: {
    type: Boolean,
    default: false
  },
  // 是否合并显示tag标签
  showMergeTags: {
    type: Boolean,
    default: true
  },
  // 数据是否懒加载
  lazy: {
    type: Boolean,
    default: false
  },
  // 懒加载方法，入参为当前元素，必须返回一个数组，若没有返回则不会显示内容
  lazyLoad: {
    type: Function
  }
}
