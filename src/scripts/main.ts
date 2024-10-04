import { storage, ref, uploadBytes, getDownloadURL } from "./firebase.ts"

// Upload Button
const upload = document.getElementById('upload-button') as HTMLButtonElement
const fileInput = document.getElementById('ifc-upload') as HTMLInputElement

upload.addEventListener('click', () => {
  fileInput.click()
})

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0]
  if (file) {
    const storageRef = ref(storage, `ifc_files/${file.name}`)
    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully', snapshot);

      const ifcLink = document.getElementById('ifc-link') as HTMLAnchorElement
      const ifcIframe = document.getElementById('ifc-iframe') as HTMLIFrameElement
      const ifcTextarea = document.getElementById('ifc-textarea') as HTMLTextAreaElement


      const fileUrl = `http://localhost:5173/src/views/viewer?filename=${file.name}`

      if (fileUrl) {
        ifcLink.href = fileUrl
        ifcLink.style.display = 'block'
        ifcLink.innerText = fileUrl

        ifcIframe.src = fileUrl
        ifcIframe.style.display = 'block'

        ifcTextarea.value = `<iframe id="ifc-iframe" src="${fileUrl}" style="width: 600px; height: 400px; border: 1px solid #ccc;"></iframe>`
        ifcTextarea.style.display = 'block'
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
  }
})