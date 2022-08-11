// 所有变量都包在这里面，以免污染全局作用域
(async function() {
  // 注入过脚本后，再次点击书签时，需要运行的函数。这个函数名会被写入书签url中
  const INJECT_FUNC_NAME = '__injectedMain__'
  // 当前js文件的所在路径，含末尾的/
  const SCRIPT_BASE = getCurrentScriptLocation()

  // 定义frame对象
  window.bookmarklet = {
    // inject脚本的运行次数
    runTimes: 0,
    /**
     * 初始化小书签配置页
     * @param {object} guidePageConfig
     * @param {string} guidePageConfig.bookmarkName 书签的名字
     * @param {string[]} guidePageConfig.usage 使用说明
     */
    setConfig(guidePageConfig) {
      if (window.__isInGuidePage__) {
        // 在guide页面加载时，注入配置
        const config = Object.assign({}, guidePageConfig, {injectFunctionName:INJECT_FUNC_NAME})
        window.setGuidePageConfig(config)
      }
    },
    /**
     * 设置点击小书签时要运行的函数
     * @param {Function} runFunction 注入脚本中的运行函数主体
     */
    async setRunnable(runFunction) {
      if (!window.__isInGuidePage__) {
        const fn = () => {
          runFunction(++this.runTimes)
        }
        window[INJECT_FUNC_NAME] = fn

        // 首次运行
        fn()
      }
    },
    // 提供给注入脚本使用的工具函数列表
    tools: {
      insertScript,
    },
  }
  // 加载注入脚本
  await insertScript('frame_tools', 'frame_tools.js', true)
  await insertScript('inject_script', 'index.js', true)

  /**
   * 插入script脚本。同样的脚本在一个网页中只会加载一次
   * @param {string} id 唯一id，用来判断当前网页中是否已加载过该脚本
   * @param {string} url 资源url，支持相对路径
   * @param {boolean?} refresh 是否要在每次新开网页后都重新加载该脚本
   * @return {Promise<unknown>}
   */
  function insertScript(id, url, refresh = false) {
    return new Promise(resolve => {
      const scriptId = `__script_${id}__`
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script")
        script.id = scriptId
        script.onload = resolve
        if (!/^\/\/?|https?:/.test(url)) {
          url = SCRIPT_BASE + url
        }
        if (refresh) {
          url += `?v=${Date.now()}`
        }
        script.src = url
        document.getElementsByTagName("head")[0].appendChild(script)
      } else {
        resolve()
      }
    })
  }

  /**
   * 获取当前js文件的所在路径
   * @return {string}
   */
  function getCurrentScriptLocation() {
    const e = new Error('err')
    const rgx = /(http|https|file):\/\/.+\.js/
    const path = (rgx.exec(e.stack) || [])[0] || ''
    return path.replace(/[^/]+\.js/, '')
  }
})()