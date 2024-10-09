import { useState, useEffect} from 'react'
import DarkModeOff from '../img/off-button.png'
import DarkModeOn from '../img/on-button.png'

const Navbar = () => {
    const [theme, setTheme] = useState('light');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const themeChanger = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return(
        <section id="navbar" className='px-6 py-2 md:px-12 md:py-4 sticky top-0 shadow-md shadow-[#D9D9D9] dark:shadow-[#343434] bg-bgd-l dark:bg-bgd-d'>
            <div className='flex items-center justify-between '>
                {/* Hidden Hamburger Icon */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                
                <ul className='hidden md:flex items-center justify-start space-x-2 md:space-x-4 lg:space-x-8'>
                    <li><a href="#hero" className='font-semibold text-md md:text-lg hover:underline underline-offset-4'>About</a></li>
                    <li><a href="#edu" className='font-semibold text-md md:text-lg hover:underline underline-offset-4'>Education</a></li>
                    <li><a href="#skills" className='font-semibold text-md md:text-lg hover:underline underline-offset-4'>Skills</a></li>
                    <li><a href="#projects" className='font-semibold text-md md:text-lg hover:underline underline-offset-4'>Projects</a></li>
                    <li><a href="#contacts" className='font-semibold text-md md:text-lg hover:underline underline-offset-4'>Contact</a></li>
                </ul>

                {/* Dark Mode Toggle Button */}
                <button onClick={themeChanger}>
                    <img src={theme === 'dark' ? DarkModeOn : DarkModeOff} alt="Toggle-Button" className='w-8 h-8'/>
                </button>
            </div>

            {isOpen && (
                <ul className='space-y-2'>
                    <li><a href="#hero" className='font-semibold text-md hover:underline underline-offset-4' onClick={toggleMenu}>About</a></li>
                    <li><a href="#edu" className='font-semibold text-md hover:underline underline-offset-4' onClick={toggleMenu}>Education</a></li>
                    <li><a href="#skills" className='font-semibold text-md hover:underline underline-offset-4' onClick={toggleMenu}>Skills</a></li>
                    <li><a href="#projects" className='font-semibold text-md hover:underline underline-offset-4' onClick={toggleMenu}>Projects</a></li>
                    <li><a href="#contacts" className='font-semibold text-md hover:underline underline-offset-4' onClick={toggleMenu}>Contact</a></li>
                </ul>
            )}
        </section>
    );
};

export default Navbar;