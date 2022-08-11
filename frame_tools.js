// 所有变量都包在这里面，以免污染全局作用域
(function() {
  // 导入工具函数
  const {insertScript} = window.bookmarklet.tools
  // 注册新的工具函数
  window.bookmarklet.tools.wait = wait
  window.bookmarklet.tools.createExcel = createExcel
  window.bookmarklet.tools.saveFile = saveFile
  window.bookmarklet.tools.saveExcelFile = saveExcelFile


  /**
   * Promise形式的setTimeout
   * @param {number} duration
   * @return {Promise<void>}
   */
  function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
  }

  /**
   * 创建excel表格
   * @param {string[]} header 表头
   * @param {string[][]} body 表格内容二维数组
   * @param {string?} sheetName 表名
   * @param {number?} defaultColumnWidth 默认的表格列宽
   * @return {Promise<ExcelJS.Workbook>}
   */
  async function createExcel(header, body, sheetName = 'Sheet1', defaultColumnWidth = 20) {
    await insertScript('exceljs', 'https://cdn.bootcdn.net/ajax/libs/exceljs/4.3.0/exceljs.min.js')

    const workbook = new ExcelJS.Workbook()
    // 冻结首行
    const worksheet = workbook.addWorksheet(sheetName, {views: [{state: 'frozen', ySplit: 1}]})

    worksheet.addRow(header)
    body.forEach(item => {
      const row = worksheet.addRow(item)
      // 自动换行
      row.alignment = {wrapText: true}
    })

    // 列宽
    worksheet.columns.forEach(item => {
      item.width = defaultColumnWidth
    })
    return workbook
  }

  /**
   * 保存到文件
   * @param {string} fileName 含后缀名
   * @param {BlobPart} buffer
   */
  function saveFile(fileName, buffer) {
    const blob = new Blob([buffer], {type: 'application/octet-stream'})

    const link = document.createElement('a')
    link.style.display = 'none'
    // Firefox workaround, see #6594
    document.body.appendChild(link)
    // TODO revokeURL
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
  }

  /**
   * 保存表格到文件
   * @param {string} fileName 无需后缀名
   * @param {ExcelJS.Workbook} workbook ExcelJS的Workbook实例
   * @return {Promise<void>}
   */
  async function saveExcelFile(fileName, workbook) {
    const buffer = await workbook.xlsx.writeBuffer()
    return saveFile(`${fileName}.xlsx`, buffer)
  }
})()