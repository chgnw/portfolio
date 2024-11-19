import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const socialMedias = [
    {
        Icon : FaInstagram,
        href : "https://www.instagram.com/ch.gnw/"
    },
    {
        Icon : FaGithub,
        href : "https://github.com/chgnw"
    },
    {
        Icon : FaLinkedin,
        href : "https://www.linkedin.com/in/chgnw/"
    },
]

const Contact = () => {
    return (
        <>
            <section id="contacts" className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <span className="text-3xl hover:underline underline-offset-4">Get in Touch With Me</span>
                    <span className="font-semibold text-[#d4d4d4]">chgnw14@gmail.com</span>
                </div>

                <div className="flex flex-row space-x-4 bg-[#222232] px-2 py-1 rounded-full">
                    {socialMedias.map((sosmed, index) => (
                        <div key={index} className="p-3 hover:bg-[#1E1E2A] rounded-full transition ease-in-out delay-50 cursor-pointer hover:scale-110">
                            <sosmed.Icon size={20} color="#d4d4d4"/>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Contact;