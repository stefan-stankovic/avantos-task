export const NotFound = () => {
  return (
    <div
      className='flex h-screen w-screen flex-col items-center justify-center '
      role='alert'
    >
      <h2 className='text-lg font-semibold text-red-500'>
        Ooops, something went wrong :(
      </h2>
    </div>
  );
};
