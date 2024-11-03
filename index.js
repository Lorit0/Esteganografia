document.getElementById("imageLoader").addEventListener("change", handleImage, false)
document.getElementById("encodeBtn").addEventListener("click", encodeMessage, false)
document.getElementById("decodeBtn").addEventListener("click", decodeMessage, false)
document.getElementById("downloadBtn").addEventListener("click", downloadImage, false)

const canvas = document.getElementById("imageCanvas")
const ctx = canvas.getContext("2d")

function handleImage(e) {
    const reader = new FileReader()
    reader.onload = function (event) {
        const img = new Image()
        img.onload = function () {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(e.target.files[0])
}

function encodeMessage() {
    const message = document.getElementById("message").value
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const binaryMessage =
        message
            .split("")
            .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join("") + "00000000"

    let dataIndex = 0
    for (let i = 0; i < imgData.data.length && dataIndex < binaryMessage.length; i += 4) {
        for (let j = 0; j < 3 && dataIndex < binaryMessage.length; j++) {
            imgData.data[i + j] =
                (imgData.data[i + j] & 0xfe) | parseInt(binaryMessage[dataIndex], 2)
            dataIndex++
        }
    }

    ctx.putImageData(imgData, 0, 0)
    alert("Mensaje ocultado en la imagen 😍")
}

function decodeMessage() {
    const decode = document.getElementById("message")
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let binaryMessage = ""
    for (let i = 0; i < imgData.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            binaryMessage += (imgData.data[i + j] & 1).toString()
        }
    }

    let message = ""
    for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.substr(i, 8)
        console.log(binaryMessage.substr(i, 8))
        console.log(binaryMessage.substring(i, i + 8))
        if (byte === "00000000") break
        message += String.fromCharCode(parseInt(byte, 2))
    }
    decode.innerHTML = message
}

function downloadImage() {
    const link = document.createElement("a")
    link.download = "image_with_hidden_message.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
}
