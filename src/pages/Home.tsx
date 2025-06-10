function Home() {
  return (
    <div className="w-full max-w-[1200px] m-auto">
      <div className="border-2 mb-[10px] h-[100px] w-full rounded-[20px]"></div>

      <div className="h-[650pxpx] w-full flex">
        <div className="mr-2 h-full w-[65%]">
          <div className="mb-[10px] border-2 h-[230px] w-full rounded-[20px]">
            <h1 className="font-main font-bold lg:text-[2.5rem] text-[2rem] my-[20px] mx-[2vw]">
              {/* Welcome Back, {document.cookie.User} */}
            </h1>
          </div>
          <div className="mb-[10px] h-[160px] w-full flex">
            <div className="border-2 w-[55%] mr-[10px] rounded-[20px]"></div>
            <div className="border-2 w-[45%] rounded-[20px]"></div>
          </div>
          <div className="mb-[10px] border-2 h-[250px] w-full rounded-[20px]"></div>
        </div>
        <div className="h-full w-[35%]">
          <div className="mb-[10px] border-2 h-[450px] w-full rounded-[20px]"></div>
          <div className="mb-[10px] border-2 h-[200px] w-full rounded-[20px]"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
