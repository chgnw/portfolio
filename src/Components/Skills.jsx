import cImg from '../img/c.png'
import pythonImg from '../img/python.png'
import htmlImg from '../img/html.png'
import tailwindImg from '../img/tailwind.png'
import reactImg from '../img/react.png'
import javaImg from '../img/java.png'

const skillsList = [
    {image: cImg, level: 'Advanced', percentage: 85},
    {image: pythonImg, level: 'Advanced', percentage: 80},
    {image: htmlImg, level: 'Advanced', percentage: 85},
    {image: tailwindImg, level: 'Intermediate', percentage: 75},
    {image: reactImg, level: 'Intermediate', percentage: 70},
    {image: javaImg, level: 'Beginner', percentage: 60},
];

const Skills = () => {
    return(
        <section id="skills" className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-acc-l dark:text-acc-d">Skills</h2>
            <div className='flex items-center justify-center'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {skillsList.map((skill, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center space-y-2 md:space-y-0 md:space-x-4"
                        style={{ width: '150px' }}
                    >
                        <img src={skill.image} alt={`Skill ${index + 1}`} className="w-full h-auto rounded-md" />
                        {/* Progress Bar and Level */}
                        <div className="w-full mt-2">
                        <div className="w-full bg-[#D9D9D9] rounded-full h-2.5 mb-1">
                            <div
                            className="bg-acc-l h-2.5 rounded-full dark:bg-acc-d"
                            style={{ width: `${skill.percentage}%` }}
                            />
                        </div>
                        <p className="font-semibold text-right text-sm text-gray-700 dark:text-gray-300">{skill.level}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Skills;