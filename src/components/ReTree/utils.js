/**
 *
 * @param {*} tree 树对象
 * @param {*} value 查询值
 * @param {*} nodeAlias 关键键名
 * @returns {Number} result
 * @description 返回ID在对应树的层级
 */
function getLevel(tree, value, nodeAlias) {
  const recursion = (list, value, nodeAlias, level) => {
    for (let index = 0; index < list.length; index++) {
      const node = list[index]
      if (node[nodeAlias.value] == value) {
        return level
      } else {
        if (node[nodeAlias.children] && node[nodeAlias.children].length) {
          const result = recursion(
            node[nodeAlias.children],
            value,
            nodeAlias,
            level + 1
          )
          if (result != undefined) {
            return result
          }
        }
      }
    }
  }
  let level = 0
  return recursion(tree, value, nodeAlias, level)
}

/**
 *
 * @param {*} tree 树对象
 * @param {*} value 查询值
 * @param {*} nodeAlias 关键键名
 * @returns {Array} 返回一个完成的树状数组
 * @description 返回扁平化数组
 */
function getFlatSelectedTree(tree, values, nodeAlias) {
  const result = []
  const recursion = (options) => {
    options.map((item) => {
      if (values.includes(item[nodeAlias.value])) {
        result.push({ ...item, [nodeAlias.children]: [] })
      }
      if (item[nodeAlias.children] && item[nodeAlias.children].length) {
        recursion(item[nodeAlias.children])
      }
    })
  }

  recursion(tree)
  return result
}

export { getLevel, getFlatSelectedTree }
