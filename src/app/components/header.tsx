'use client';

import Image from 'next/image';

type HeaderProps = {
  title?: string; // Add a prop to customize the title
};

const Header = ({ title = 'Discover' }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-10">
      <div className="flex flex-col items-center py-4 bg-white">
        <Image
          src="/images/logo.png" // Replace with your actual image path
          alt="Logo"
          width={56}
          height={56}
        />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
