// 所有变量都包在这里面，以免污染全局作用域
(function() {
  // 初始化小书签配置页
  window.bookmarklet.setConfig({
    // 书签的名字
    bookmarkName: '导出表格数据',
    // 使用说明
    usage: [
      '请将上面的链接拖放到书签栏',
      '打开xx页面',
      '点击书签栏上的书签',
    ],
  })

  // 设置点击小书签时要运行的函数
  window.bookmarklet.setRunnable(async () => {
    console.log('bookmarklet clicked!')
    // 导入工具函数
    const {createExcel, saveExcelFile, wait} = window.bookmarklet.tools

    const workbook = await createExcel(['No.', 'Value'], [[12, 'aa'], [34, 'bb']])
    await wait(2000)
    await saveExcelFile('export', workbook)

    console.log('export done')
  })
})()