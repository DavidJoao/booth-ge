    import React, { useState, useContext } from "react"
    import axios from "@/custom/axios"
    import AuthContext from "@/custom/AuthProvider"
    import imageCompression from "browser-image-compression"
    import { PuffLoader } from "react-spinners"

    const Upload = () => {
    const { auth } = useContext(AuthContext)
    const [file, setFile] = useState(null)
    const [images, setImages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")

    console.log(auth.name)

    const handleFileUpload = event => {
        const file = event.target.files[0]
        setFile(file)
    }

    const handleDocsSubmit = e => {
        e.preventDefault()

        setIsLoading(true)
        setStatusMessage("Submitting Docs, Please Wait...")

        const formData = new FormData()
        formData.append("file", file, `${auth.name} - Document`)

        axios
            .post("/api/uploads/docs", formData, {
                headers: { "Content-Type": "application/octet-stream" },
            })
            .then(res => {
                setFile(null)
                setStatusMessage("✓ Successfully Submitted ✓")
                setTimeout(() => {
                setIsLoading(false)
                }, 2000)
            })
            .catch(error => console.error("Error uploading PDF:", error))
    }

    const handleImageUpload = e => {
        const files = Array.from(e.target.files)

        const compressPromises = files.map(file => {
            return new Promise(async (resolve, reject) => {
                try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 800,
                })

                const reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsDataURL(compressedFile)
                } catch (error) {
                reject(error)
                }
            })
        })

        Promise.all(compressPromises)
            .then(base64Images => {
                setImages([...images, ...base64Images])
            })
            .catch(error => {
                console.error("Error reading file:", error)
            })
    }

    const handleImagesSubmit = e => {
        e.preventDefault()

        setIsLoading(true)
        setStatusMessage("Submitting Images, Please Wait...")

        const userObj = { name: auth.name }
        axios
            .post("/api/uploads/images", { images, userObj })
            .then(res => {
                setImages([])
                setStatusMessage("✓ Successfully Submitted ✓")
                setTimeout(() => {
                setIsLoading(false)
                }, 2000)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px] lg:p-4 lg:pt-[80px]">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                <PuffLoader color="#ffffff" loading={isLoading} size={120} />
                <p className="mt-4">{statusMessage}</p>
                </div>
            ) : (
                <>
                <form
                    className="flex flex-col items-center justify-center p-4 rounded"
                    id="menu"
                    onSubmit={handleDocsSubmit}>
                    <label>Upload PDF Document (No Images) </label>
                    <input required type="file" className="input" onChange={handleFileUpload} />
                    <button type="submit" className="buttons mt-3 w-[80%]">
                        {" "}
                        Submit{" "}
                    </button>
                </form>

                <form
                    className="flex flex-col items-center justify-center p-4 rounded mt-5"
                    id="menu"
                    onSubmit={handleImagesSubmit}>
                    <label> Upload Images</label>
                    <input required type="file" className="input" onChange={handleImageUpload} multiple />
                    <button type="submit" className="buttons mt-3 w-[80%]">
                        {" "}
                        Submit{" "}
                    </button>
                    {images.length > 0 ? (
                        <div
                            id="navbar"
                            className="w-[80%] rounded mt-2 flex flex-row items-center overflow-x-auto border p-2">
                            {images.length > 0 ? (
                            images.map((image, index) => {
                                return (
                                    <>
                                        <img src={image} className="w-[150px] m-2" />
                                        <button className="mr-3 bg-red-600 rounded p-1" onClick={(e) => {
                                            e.preventDefault();
                                            const updatedImages = images.filter((_, i) => i !== index);
                                            setImages(updatedImages);
                                        }}>x</button>
                                    </>
                                )
                            })
                            ) : (
                            <></>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </form>
                </>
            )}
        </div>
   )
}

export default Upload
