import hsImg from '../img/hsImg.png'
import uniImg from '../img/uniImg.png'

const educationList = [
    {title: 'Kristen Yusuf Highschool', period: '2019 - 2022', image: hsImg},
    {title: 'Binus University', period: '2022 - Now', image: uniImg},
];

const Education = () => {
    return(
        <section id="edu" className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
                My <span className="text-acc-l dark:text-acc-d">Education</span> Timeline
            </h2>

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                {educationList.map((education, index) => (
                    <div key={index} className="flex-1 p-4 bg-acc-l dark:bg-acc-d rounded-lg shadow-md flex flex-col items-center">
                        <img src={education.image} alt="" className='w-52 h-24 md:w-60 md:h-40 rounded-xl mb-4 object-cover'/>
                        <h3 className="text-lg font-semibold text-white">{education.title}</h3>
                        <p className="text-sm text-white mt-2">{education.period}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Education;