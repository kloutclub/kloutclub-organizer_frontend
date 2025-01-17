import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link, useParams } from "react-router-dom";
import HeadingH2 from "../../component/HeadingH2";
import { heading } from "../heading/headingSlice";
import { useDispatch } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import Swal from "sweetalert2";
import Files from "./Files";

interface Folder {
    path: string;
    name: string;
    id: string;
}

// Define constants or types for chunk size and apiUrl
const CHUNK_SIZE = 5 * 1024 * 1024; // Example chunk size: 1MB

const Photos: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const photApiBaseUrl = import.meta.env.VITE_PHOTO_API_URL;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    // const { currentEventUUID } = useSelector((state: RootState) => (state.events));
    const { events } = useSelector((state: RootState) => (state.events));

    const currentEvent = events.find((event) => event.uuid === uuid);
    const [groupingDone, setGroupingDone] = useState<boolean>(false);
    const [segregationStatus, setSegregationStatus] = useState<string>("No segregation status is found against this event");

    const [eventZip, setEventZip] = useState<File[]>([]);
    const [profileZip, setProfileZip] = useState<File[]>([]);
    const [email,] = useState<string>(user?.email || "");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [apiResponse, setApiResponse] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string>("2");
    const [downloadUrl, setDownloadUrl] = useState<string>("");

    const [active, setActive] = useState<1 | 2>(1);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [path, setPath] = useState<string>('');
    const [files, setFiles] = useState<boolean>(false);
    const [uploadsCompleted, setUploadsCompleted] = useState<boolean>(false);
    const [uploadedCount, setUploadedCount] = useState<number>(0);

    // State to track upload progress
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>): void => setSelectedOption(e.target.value);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setEventZip(Array.from(e.target.files));
        }
    };
    const handleProfileFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
            setProfileZip(Array.from(e.target.files));
        }
    };

    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        axios.post("https://app.klout.club/api/organiser/v1/event-checkin/get-event-photo-folders",
            {
                eventUUID: uuid,
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then(res => {
            console.log("All folders are: ", res.data);
            setFolders(res.data.folders);
        })
    }, []);

    const uploadChunks = (file: File, fieldName: string): Promise<void> => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let totalProgress = 0; // Variable to track overall progress for the file

        return new Promise((resolve, reject) => {
            let chunkIndex = 0;
            let uploadComplete = true; // Flag to track if all chunks upload successfully

            const uploadNextChunk = () => {
                if (chunkIndex >= totalChunks) {
                    setUploadedCount(prev => prev + 1);
                    console.log("The value is: ", uploadedCount);
                    console.log("All Chunks Uploaded");

                    resolve(); // All chunks uploaded successfully for this file
                    return true;
                }

                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append("fileChunk", chunk);
                formData.append("fileName", file.name);
                formData.append("chunkIndex", chunkIndex.toString());
                formData.append("totalChunks", totalChunks.toString());
                formData.append("fieldName", fieldName);
                formData.append("email", email);
                if (uuid) {
                    formData.append("event_uuid", uuid);
                }

                const xhr = new XMLHttpRequest();
                xhr.open("POST", `${photApiBaseUrl}/upload`, true);

                // Progress event listener to track upload percentage for the file
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentage = Math.round((event.loaded / event.total) * 100);

                        // Update total progress by distributing it across chunks
                        totalProgress = Math.round(((chunkIndex + percentage / 100) / totalChunks) * 100);

                        // Update the progress for the current file
                        setUploadProgress((prevProgress) => ({
                            ...prevProgress,
                            [file.name]: totalProgress,
                        }));
                    }
                };

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            chunkIndex++;
                            uploadNextChunk();
                        } else {
                            uploadComplete = false; // Mark upload as failed if the chunk fails
                            reject(new Error(`Error uploading chunk ${chunkIndex + 1}/${totalChunks} for ${file.name}`));
                        }
                    }
                };

                xhr.send(formData);
            };

            uploadNextChunk();

            // If any error occurs during chunk upload, reject the promise
            if (!uploadComplete) {
                reject(new Error(`Failed to upload chunks for ${file.name}`));
            }
        });
    };

    useEffect(() => {
        if (uploadedCount === 2) {
            console.log(uploadedCount);
            setUploadsCompleted(true); // Mark that uploads for all files are done
            setLoading(false);
            setUploadProgress({});
            Swal.fire({
                title: 'Success!',
                text: 'All chunks uploaded successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        }
    }, [uploadedCount]);

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setIsSubmitting(true);
        setApiResponse("");
        setError("");
        setDownloadUrl("");

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload eventZip files
            for (const file of eventZip) {
                await uploadChunks(file, "event_zip");
            }

            // Upload profileZip files
            for (const file of profileZip) {
                await uploadChunks(file, "profile_zip");
            }

        } catch (error) {
            console.error("Error uploading files:", error);
            setLoading(false);
            setIsSubmitting(false);
            setApiResponse("Error, try again later!");
        }
    };

    useEffect(() => {

        try {
            axios.post("https://app.klout.club/api/organiser/v1/event-checkin/get-image-segregation-status",
                {
                    "eventUUID": uuid
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    console.log(res.data);
                    // if (res.data.data.finalStatus) {
                    //     setGroupingDone(true);
                    // }
                    if (res.data.data.message === "Grouping In Process") {
                        // setGroupingDone(false);
                        setSegregationStatus("Grouping In Progress");
                    }

                    else if (res.data.data.message === "Unzip Successfully") {
                        setGroupingDone(true);
                        setSegregationStatus("Unzip Successfully");
                        // setSegregationStatus("Segregation status is found successfully");
                    }

                    else {
                        // setGroupingDone(false);
                    }
                });
        } catch (error) {
            console.log(error);
        }

    }, []);


    const handleDownload = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/get-event-attendee-numbers`,
                {
                    event_uuid: uuid,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob', // Important to handle the file as a blob
                }
            );

            // Create a URL for the response data (which is the zip file)
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'profile_images.zip'); // Filename for the downloaded file
            document.body.appendChild(link);
            link.click();

            // Clean up the URL object after download is triggered
            window.URL.revokeObjectURL(url);

            setLoading(false);
        } catch (err) {
            console.error('Error downloading file:', err);
            setError('An error occurred while downloading the file');
            setLoading(false);
        }
    };

    const getAttendeeProfileImage = async () => {
        console.log("Working");

        handleDownload();
    }

    const handleImageRecognition = () => {

        fetch(`https://app.klout.club/api/organiser/v1/event-checkin/grouping-photo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventUUID: uuid
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === true) {
                    // Show success alert using SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: data.message,
                    }).then(() => {
                        // Reset states to their initial values after success
                        window.location.reload();
                    });
                } else {
                    // Show error alert using SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!'
                    });
                }
            })
            .catch(error => {
                // If the fetch fails, show an error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while processing your request.'
                });
                console.error('Error:', error);
            });
    };

    return (
        <div className="h-full w-full">
            {/* Heading */}
            <div className="mb-4 flex justify-between items-center">
                <HeadingH2 title={currentEvent?.title} />
                <div className='flex items-center gap-3'>
                    <Link to="/all-photos/" onClick={() => dispatch(heading("All Photos"))} className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            <div className="mx-auto w-full grid place-content-center mt-10">
                <div className="flex justify-between">
                    <div>
                        <button onClick={() => { setActive(1); setFiles(false); }} className={`btn ${active === 1 ? "bg-white" : ""} btn-sm rounded-b-none`}>Upload Files</button>
                        <button onClick={() => { setActive(2); setFiles(false); }} className={`btn ${active === 2 ? "bg-white" : ""} btn-sm rounded-b-none`}>Folders</button>
                    </div>
                    <button onClick={getAttendeeProfileImage} className="btn btn-sm rounded-b-none btn-accent text-white w-fit">Get Attendee Image Zip</button>
                </div>

                <div className="max-w-3xl min-w-[48rem] relative p-10 bg-white rounded-b-md shadow-md">
                    {active === 1 && <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <label htmlFor="eventImages" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Event Zip Files: <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' />
                            </span>
                            <input
                                id="eventImages"
                                type="file"
                                multiple
                                required
                                className="grow"
                                onChange={handleFileChange}
                            />
                        </label>

                        <label htmlFor="profileImages" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Profile Zip Files: <span className="text-red-600 ml-1">*</span>  &nbsp; <TiArrowRight className='mt-1' />
                            </span>
                            <input
                                id="profileImages"
                                type="file"
                                multiple
                                required
                                className="grow"
                                onChange={handleProfileFileChange}
                            />
                        </label>

                        <label htmlFor="email_id" className="input input-bordered bg-white text-black/50 flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Email <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="email_id" value={email} required readOnly type="email" className="grow" />
                        </label>

                        <label htmlFor="option" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold min-w-fit text-green-700 flex justify-between items-center">Send Option: <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select className="w-full h-full border-none outline-none" value={selectedOption} required onChange={handleOptionChange}>
                                <option value="2" className="border-none outline-none">Provide Download Link</option>
                            </select>
                        </label>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-klt_primary-500 text-white mx-auto w-fit">
                            {loading ? "Uploading..." : "Submit"}
                        </button>
                        {/* {uploadProgress && <button className="btn w-fit mx-auto bg-warning text-white">Process Image Recognition</button>} */}
                        {uploadsCompleted && (
                            <button onClick={handleImageRecognition} type="button" className="btn w-fit mx-auto bg-amber-400 hover:bg-amber-600 text-white">
                                Process Image Recognition
                            </button>
                        )}

                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {apiResponse && <p>{apiResponse}</p>}
                        {downloadUrl && (
                            <div className="apiResponseMessage">
                                <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download file
                                </a>
                            </div>
                        )}

                        <div>
                            {Object.entries(uploadProgress).map(([fileName, percentage]) => (
                                <div key={fileName} className="progress-container">
                                    <span>{fileName} - {percentage}%</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </form>}

                    {
                        active === 2 && !files && <div>

                            {groupingDone === true && segregationStatus === "Unzip Successfully" ? <div className="grid grid-cols-4 gap-5 select-none">
                                {
                                    folders.length !== 0 ? folders.map((folder) => (
                                        <div key={folder.id} onDoubleClick={() => { setFiles(true); setPath(folder.id) }} className="p-2 hover:bg-sky-500/20 flex flex-col items-center">
                                            <FcOpenedFolder size={80} />
                                            <span className="capitalize">{folder.name}</span>
                                            {/* {files && <Files userId={folder.name}/>} */}
                                        </div>
                                    )): <p className="text-center w-full select-text col-span-4">No folders found</p>
                                }
                                {/* <FcOpenedFolder size={80} className="p-2 hover:bg-sky-500/20" />
                                <FcOpenedFolder size={80} className="p-2 hover:bg-sky-500/20" />
                                <FcOpenedFolder size={80} className="p-2 hover:bg-sky-500/20" /> */}
                            </div> : segregationStatus === "Grouping In Progress" ?
                                <p className="text-black text-center">Grouping In Progress</p> : <p className="text-center">{segregationStatus}</p>
                            }

                        </div>
                    }

                    {files && <Files uuid={uuid} id={path} setFiles={setFiles} />}
                </div>
            </div>
        </div>
    );
};

export default Photos;
