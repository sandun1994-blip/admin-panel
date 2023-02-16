export default function Footer() {
  return (
    <>
      <div className="laout-footer">
        <div className="shadow-md w-full relative bottom-0 left-0">
          <div className="md:flex justify-center items-center bg-white py-4 md:px-10 px-7 dark:bg-gray-900">
            <span className="text-center font-thin text-sm">
             
              Developed By Team DBS96 &copy; { new Date().getFullYear() } - Grade5 App
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
