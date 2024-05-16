import Tabs from './Tabs';
import ProfileCard from './ProfileCard';
import image from '@/public/images/Simon.webp';
import Image from 'next/image';
import Overview from './Overview';

const ContentCard = () => {
  return (
    <div>
      <div className=" bg-primary w-full  h-[140px]"></div>
      <div className="  px-[5%] mt-[-2rem]">
        <div className="">
          <div className="flex items-center gap-5">
            <div className=" w-[150px] bg-white flex items-center justify-center h-[150px] rounded-full">
              <Image
                className="  bg-primary w-[140px] h-[140px] rounded-full"
                src={image}
                alt=""
              />
            </div>
            <div className=" space-y-1">
              <h1 className=" text-xl font-bold">Simon Adjei Tawiah</h1>
              <p className=" text-sm ">Software Engineer @ Dev2Win</p>
              <p className=" text-sm">Career : Computer Engineering </p>
            </div>
          </div>
          <div className="">
            <Tabs
              tabs={[
                {
                  title: 'Overview',
                  content: <div><Overview /></div>,
                  value: '',
                },
                {
                  title: 'Reviews',
                  content: <div>hello i am reviews</div>,
                  value: 5,
                },
                {
                  title: 'Mentees',
                  content: <ProfileCard />,
                  value: '',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
