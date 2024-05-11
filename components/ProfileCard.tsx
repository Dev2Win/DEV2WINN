const ProfileCard = ({ name, image, title }: any) => {
  return (
    <div className=" md:w-[250px] h-[240px]  flex flex-col items-center justify-center space-y-3 shadow-xl">
      <div className=" bg-red-100 w-[115px] h-[115px] rounded-full flex items-center justify-center ">
        <img
          className=" bg-primary    object-contain  rounded-full w-[110px] h-[110px]"
          src={image}
          alt=""
        />
      </div>
      <div className=" flex items-center gap-1  flex-col">
        <h1 className="font-bold text-lg">{name}</h1>
        <p className=" text-sm">{title}</p>
        <div className=" flex items-center gap-1">
          <p className=" text-primary text-lg">✔</p>
          <p className=" text-sm">KNUST, Ghana </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
