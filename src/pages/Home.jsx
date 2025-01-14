import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { languages } from "../constantsVersions"; // Import the languages list

const Home = () => {
    const [formData, setFormData] = useState({
        userName: "",
        roomId: "",
        language: "",
    });

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setFormData((prev) => ({ ...prev, roomId: id }));
        toast.success("Room ID created successfully");
    };


    const navigate = useNavigate();
    const joinRoom = () => {
        if (!formData.roomId || !formData.userName || !formData.language) {
            toast.error("Please fill all the fields");
            return;
        }
        // console.log("Navigating with:", formData);
        // localStorage.setItem("userName", JSON.stringify(formData.userName));
        // localStorage.setItem("language", JSON.stringify(formData.language));
        // navigate(`/${formData.roomId}/editor`);
    };

    const handleInputEnter = (e) => {
        if (e.code === "Enter") {
            if (!formData.roomId || !formData.userName || !formData.language) {
                toast.error("Please fill all the fields");
                return;
            }
            joinRoom();
        }
    };

    return (
     <>
            <div className="flex justify-center items-center flex-col h-[90vh] overflow-hidden w-[90%] mx-auto">
              <div className="bg-[#161515] p-10 rounded ">
                    <h2 className="text-blue-500 text-3xl font-bold">Welcome to Collaboration Editor</h2>
                        <p className="text-sm text-center">
                            Collaborate with your team on a real-time text editor.
                        </p>
                        <form className="flex flex-col gap-3">
                            <h4 className="flex mt-10 font-semibold">Paste Invitation ID</h4>
                            <input
                                type="text"
                                placeholder="Enter your Room ID"
                                className="py-2 px-3 bg-transparent border border-gray-100 rounded focus:outline-none focus:blue-800"
                                onChange={(e) =>
                                    setFormData({ ...formData, roomId: e.target.value })
                                }
                                value={formData.roomId}
                                onKeyUp={handleInputEnter}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                 className="py-2 px-3 bg-transparent border border-gray-100 rounded focus:outline-none focus:blue-800"
                                onChange={(e) =>
                                    setFormData({ ...formData, userName: e.target.value })
                                }
                                value={formData.userName}
                                onKeyUp={handleInputEnter}
                            />

                            <h4 className="flex mt-5 font-semibold">Select Language</h4>
                            <select
                                 className="py-2 px-3 bg-transparent border border-gray-100 rounded focus:outline-none focus:blue-800"
                                value={formData.language}
                                onChange={(e) =>
                                    setFormData({ ...formData, language: e.target.value })
                                }
                            >
                                <option value="" className="bg-black">
                                    Select Language
                                </option>
                                {languages?.map((language) => (
                                    <option key={language.languageId} 
                                    className="bg-black"
                                    value={language.languageName}>
                                        {language.languageName}
                                    </option>
                                ))}
                            </select>

                            <Link
                                 to={
                                    formData.roomId && formData.userName && formData.language
                                      ? `/editor/${formData.roomId}?userName=${encodeURIComponent(formData.userName)}&language=${encodeURIComponent(formData.language)}`
                                      :"/"
                                       }
                                       onClick={joinRoom}
                                       className="ml-auto px-6 py-2  bg-[#261397] w-20 rounded shadow  font-semibold hover:bg-[#643b7e] transition-all duration-200">
                                Join
                            </Link>
                            <span className="">
                                If you don't have an invite, then create &nbsp;
                                <button onClick={createNewRoom} className="text-blue-600 hover:text-blue-400 transition-all duration-200 font-semibold">
                                    New Room
                                </button>
                            </span>
                        </form>
                       
                    </div>
                    
              </div>
              <footer className="text-center font-semibold text-blue-500">
                            Built with 💛 by{" "}
                            <a href="https://www.google.com">Krishna Kant</a>
                        </footer>
              </>
    );
};

export default Home;
