const downloadGitRepo = require('download-git-repo')
const fs = require('fs')
// const readLine = require('readline')
const { rcPath } = require('./options')
const { logWithSpinner, stopSpinner, failSpinner, error, chalk, succeedSpinner } = require('./share-utils')

const DOWNLOAD_STATUS = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL'
}

const capitalizeTheFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// function readFileToArr (fileName, callback) {
//   if (!fs.existsSync(fileName)) return

//   let arr = []
//   let readObj = readLine.createInterface({
//     input: fs.createReadStream(fileName)
//   })

//   // 一行一行地读取文件
//   readObj.on('line', function (line) {
//     arr.push(line)
//   })

//   // 读取完成后,将arr作为参数传给回调函数
//   readObj.on('close', function () {
//     callback(arr)
//   })
// }

module.exports = class Generator {
  constructor (preset, context) {
    this.preset = preset
    this.context = context

    const { frameType, templateType } = this.preset

    this.REPO_NAME = `${frameType.toUpperCase()}_${templateType.toUpperCase()}_TEMPLATE_REPO`
    this.GENERATION_METHODS_NAME = `generate${capitalizeTheFirstLetter(frameType)}${capitalizeTheFirstLetter(templateType)}Project`

    this.generate = this.generate.bind(this)
  }

  /**
   * 拷贝项目
   */
  download () {
    const { generate } = this
    const PATH = this.getDownloadPath()

    logWithSpinner('⚓', `Running download...`)

    downloadGitRepo(PATH, this.context, { clone: true }, function (err) {
      if (err) {
        failSpinner('Running download fail!')
        console.log(err)
        process.exit(1)
      } else {
        succeedSpinner('Running download success!!')
        generate()
      }
      stopSpinner()
    })
  }

  generate () {
    if (this[this.GENERATION_METHODS_NAME]) this[this.GENERATION_METHODS_NAME]()
  }

  /**
   * 创建vue的后台管理模块
   */
  async generateVueAdminProject () {
    // const {
    //   publicPath,
    //   adminTitle,
    //   adminName,
    //   port
    // } = this.preset

    // const ENV_PATH = this.context + '/.env'

    // readFileToArr(ENV_PATH, arr => {
    //   let resultArray = []
    //   const reg = /(.*=).+/
    //   for (let item of arr) {
    //     let splitString = item.split('=')[0].trim()
    //     if (item) {
    //       if (splitString === 'VUE_APP_PUBLIC_PATH') item = item.replace(reg, '$1' + (publicPath || '/'))
    //       if (splitString === 'VUE_APP_ADMIN_TITLE') item = item.replace(reg, '$1' + (adminTitle || ''))
    //       if (splitString === 'VUE_APP_ADMIN_NAME') item = item.replace(reg, '$1' + (adminName || ''))
    //       if (splitString === 'PORT') item = item.replace(reg, '$1' + port)
    //     }
    //     resultArray.push(item)
    //   }
    //   fs.writeFile(ENV_PATH, resultArray.join("\n"),
    //     function (err) {
    //       if (err) {
    //         throw err
    //       }
    //     })
    // })
  }

  run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args, { cwd: this.context })
  }

  getDownloadPath () {
    const { frameType, templateType } = this.preset
    const REPO_NAME = `${frameType.toUpperCase()}_${templateType.toUpperCase()}_TEMPLATE_REPO`

    const config = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))

    const { config: repoConfig = {} } = config ? config || {} : {}

    // 先读用户修改的模板
    const repoPath = repoConfig[REPO_NAME] || config[REPO_NAME]

    if (!repoPath) {
      console.error(chalk.red.dim('Error: 当前模版类型不存在, 请联系cli管理员!'))
      process.exit(1)
    }

    return repoPath
  }
}
