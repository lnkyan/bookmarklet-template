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
window.bookmarklet.setClickHandler(async () => {
  console.log('bookmarklet clicked!')
  // 导入工具函数
  const {createExcel, saveExcelFile, wait} = await window.bookmarklet.loadTools()

  const {header, body} = await fetchExcelData()
  const workbook = await createExcel(header, body)
  await saveExcelFile('export', workbook)

  console.log('export done')

  async function fetchExcelData() {
    await wait(2000)
    return {
      header: ['No.', 'Value'],
      body: [[12, 'aa'], [34, 'bb']],
    }
  }
})