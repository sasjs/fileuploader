let sasjs

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
  uploadForm.style.display = 'flex'
  uploadButton.style.display = 'inline-block'
}

function upload() {
  const x = document.getElementById('myfile')
  const filePath = document.getElementById('filePath').value
  const chunkSize = 10 * 2 ** 20

  const file = x.files[0]
  if (file) {
    const numberOfChunks = Math.ceil(file.size / chunkSize)
    for (let i = 0; i < numberOfChunks; i++) {
      const chunkStart = chunkSize * i
      const chunkEnd = Math.min(chunkStart + chunkSize, file.size)
      const chunk = file.slice(chunkStart, chunkEnd)
      const newFile = new File([chunk], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      })
      if (i === 0) {
        await sasjs
          .uploadFile(
            'services/common/upload',
            [{ file: newFile, fileName: file.name }],
            { path: filePath }
          )
          .then(
            (res) => {
              if (typeof res.dirlist === 'object') {
                populateTable(res.dirlist)
              } else {
                alert('Error Occurred')
                console.log('FAILED')
                console.log(res)
                throw new Error('Response does not contain dir list')
              }
            },
            (err) => {
              alert('Error Occurred')
              console.log('FAILED')
              throw err
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
              console.log(res)
            },
            (err) => {
              alert('Error Occurred')
              console.log('FAILED')
              console.log(err)
              throw new Error(err)
            }
          )
      }
    }
  }
}

function fileChange() {
  const uploadButton = document.querySelector('#upload')
  const x = document.getElementById('myfile')
  let txt = ''
  if ('files' in x) {
    if (x.files.length == 0) {
      txt = 'Select file to upload.'
      uploadButton.disabled = true
    } else {
      uploadButton.disabled = false
      for (let i = 0; i < x.files.length; i++) {
        txt += '<br><strong>' + (i + 1) + '. file</strong><br>'
        const file = x.files[i]
        if ('name' in file) {
          txt += 'name: ' + file.name + '<br>'
        }
        if ('size' in file) {
          txt += 'size: ' + (file.size / 1024).toFixed(2) + ' bytes <br>'
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
