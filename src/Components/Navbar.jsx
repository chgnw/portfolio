import { RiHome6Line } from "react-icons/ri";
import { BsPersonVcard } from "react-icons/bs";
import { IoTerminalOutline } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineHandshake } from "react-icons/md";
import { motion } from "framer-motion";

const icons = [
    {
        Icon : RiHome6Line,
        href : "#home"
    },
    {
        Icon : BsPersonVcard,
        href : "#about"
    },
    {
        Icon : IoTerminalOutline,
        href : "#skills"
    },
    {
        Icon : CgWebsite,
        href : "#projects"
    },
    {
        Icon : MdOutlineHandshake,
        href : "#contacts"
    },
];

const Navbar = () => {
    return (
        <>
            <motion.section  variants={{ hidden: {opacity: 0}, show: {opacity: 1}, transition: {staggerChildren: 0.01} }} initial='hidden' animate='show' id="navbar" className="flex items-center justify-center p-2 sticky top-0 z-10">
                <div className="flex flex-shrink-0 items-center">
                    <div className="Menus flex flex-row space-x-4 bg-[#222232] px-2 py-1 rounded-full">
                        {icons.map((icon, index) => (
                            <a key={index} href={icon.href}>
                                <div className="p-3 hover:bg-[#1E1E2A] rounded-full transition ease-in-out delay-50 cursor-pointer hover:scale-110">
                                    <icon.Icon size={20} color="#d4d4d4"/>
                                </div>
                            </a> 
                        ))}
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default Navbar;