let sasjs
let cancelled = false

function login() {
  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value
  sasjs.logIn(username, password).then((response) => {
    if (response.isLoggedIn === false) {
      alert('Invalid Username/Password')
    } else {
      afterLogin()
    }
  })
}

function afterLogin() {
  const loginForm = document.querySelector('#login-form')
  const loginButton = document.querySelector('#login')
  loginForm.style.display = 'none'
  loginButton.style.display = 'none'

  const uploadForm = document.querySelector('#upload-form')
  const uploadButton = document.querySelector('#upload')
  const cancelButton = document.querySelector('#cancel')
  uploadForm.style.display = 'flex'
  uploadButton.style.display = 'inline-block'
  cancelButton.style.display = 'inline-block'
}

async function upload() {
  const uploadButton = document.querySelector('#upload')
  uploadButton.disabled = true
  const cancelButton = document.querySelector('#cancel')
  cancelButton.disabled = false
  const x = document.getElementById('myfile')
  const filePath = document.getElementById('filePath').value
  const chunkSize = 5 * 1024 * 1024 //chunk size is 5MB
  const progressBar = document.getElementById('progressBar')
  const barStatus = document.getElementById('barStatus')
  const fileUploadStatus = document.getElementById('fileUploadStatus')
  fileUploadStatus.innerText = '0%'
  progressBar.style.height = '30px'
  let completed = true
  const file = x.files[0]
  if (file) {
    const numberOfChunks = Math.ceil(file.size / chunkSize)

    for (let i = 0; i < numberOfChunks; i++) {
      if (cancelled === true) {
        completed = false
        alert('Upload cancelled')
        break
      }
      const chunkStart = chunkSize * i
      const chunkEnd = Math.min(chunkStart + chunkSize, file.size)
      const chunk = file.slice(chunkStart, chunkEnd)
      const newFile = new File([chunk], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      })
      const status = Math.ceil((chunkEnd / file.size) * 100) + '%'
      if (i === 0) {
        await sasjs
          .uploadFile(
            'services/common/upload',
            [{ file: newFile, fileName: file.name }],
            { path: filePath }
          )
          .then(
            (res) => {
              if (res?.sasjsAbort) {
                const error = `MAC: ${res.sasjsAbort[0].MAC}\n MSG: ${res.sasjsAbort[0].MSG}`
                displayError(new Error(error))
              }
              if (typeof res?.dirlist === 'object') {
                fileUploadStatus.innerText = `Uploaded: ${bytesToSize(
                  chunkEnd
                )} (${status})`
                barStatus.style.width = status
                populateTable(res.dirlist)
              } else {
                displayError(new Error('Response does not contain dir list'))
              }
            },
            (err) => {
              displayError(err)
            }
          )
      } else {
        await sasjs
          .uploadFile(
            'services/common/append',
            [{ file: newFile, fileName: file.name }],
            { path: filePath }
          )
          .then(
            (res) => {
              barStatus.style.width = status
              fileUploadStatus.innerText = `Uploaded: ${bytesToSize(
                chunkEnd
              )} (${status})`
            },
            (err) => {
              displayError(err)
            }
          )
      }
    }
    setTimeout(function () {
      if (completed) {
        alert('Successfully Uploaded')
      }
      resetPage()
    }, 10)
  }
}

function cancel() {
  console.log('upload cancelled')
  const cancelButton = document.querySelector('#cancel')
  cancelButton.disabled = true
  cancelled = true
}

function resetPage() {
  document.querySelector('#upload').disabled = true
  document.querySelector('#cancel').disabled = true
  document.getElementById('filestatus').innerHTML = 'Select file to upload.'
  document.getElementById('myfile').value = ''
  document.getElementById('progressBar').style.height = '0px'
  document.getElementById('barStatus').style.width = '0%'
  document.getElementById('fileUploadStatus').innerText = ''
  document.getElementById('dirlist').style.display = 'none'
  document.getElementById('horizontalLine').style.display = 'none'
  cancelled = false
}

function displayError(err) {
  alert('Error Occurred')
  resetPage()
  const requests = sasjs.getSasRequests()
  if (requests.length > 0 && requests[0].logFile) {
    const logFile = requests[0].logFile.replace(/\n*$/, '')
    document.getElementById('horizontalLine').style.display = 'block'
    document.getElementById('clearLog').style.display = 'inline-block'
    document.getElementById('logTitle').style.display = 'inline-block'
    const log = document.getElementById('log')
    log.innerHTML = logFile
    log.style.display = 'block'
  }
  throw err
}

function clearLog() {
  document.getElementById('horizontalLine').style.display = 'none'
  document.getElementById('logTitle').style.display = 'none'
  document.getElementById('log').style.display = 'none'
  document.getElementById('clearLog').style.display = 'none'
}

function fileChange() {
  const uploadButton = document.querySelector('#upload')
  const filePath = document.getElementById('filePath').value
  const x = document.getElementById('myfile')
  let txt = ''
  if ('files' in x) {
    if (x.files.length == 0) {
      txt = 'Select file to upload.'
      uploadButton.disabled = true
    } else {
      uploadButton.disabled = false
      const file = x.files[0]
      if (file) {
        if ('name' in file) {
          txt += `Location: ${filePath}/${file.name} <br>`
        }
        if ('size' in file) {
          txt += 'Total Size: ' + bytesToSize(file.size) + '<br>'
        }
      }
    }
  } else {
    if (x.value == '') {
      txt += 'Select file to upload.'
    } else {
      txt += 'The files property is not supported by your browser!'
      txt += '<br>The path of the selected file: ' + x.value // If the browser does not support the files property, it will return the path of the selected file instead.
    }
  }
  document.getElementById('filestatus').innerHTML = txt
}

function setDebugState() {
  const state = document.getElementById('debug').checked
  sasjs.setDebugState(state)
}

function populateTable(list) {
  document.getElementById('horizontalLine').style.display = 'block'
  const table = document.getElementById('dirlist')
  const tbody = table.children[0]

  const tableHeader = tbody.children[0]

  tbody.textContent = ''
  tbody.appendChild(tableHeader)

  list.forEach((l) => {
    const tr = document.createElement('TR')
    const td = document.createElement('TD')
    td.appendChild(document.createTextNode(l.FILEPATH))
    tr.appendChild(td)
    tbody.appendChild(tr)
  })
  table.style.display = 'block'
}

function bytesToSize(
  bytes,
  decimals = 1,
  maxValue = 1024 * 1024 * 1024 * 1024 // 1TB
) {
  if (bytes === 0) return '0 B'

  bytes = bytes > maxValue ? maxValue : bytes

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i]
}
