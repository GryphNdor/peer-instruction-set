'use client';

import Image from 'next/image';

type HeaderProps = {
  title?: string; // Add a prop to customize the title
  subtitle?: string; // Add a subtitle
};

const Header2 = ({ title = 'Discover', subtitle = 'Recipe' }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-10">
      <div className="flex items-center py-4 px-6 bg-white">
        {/* Image on the left */}
        <Image
          src="/images/logo.png" // Replace with your actual image path
          alt="Logo"
          width={56}
          height={56}
          className="mr-4 mx-2" // Add some margin to the right of the image
        />
        {/* Texts on the right */}
        <div className="flex flex-col pl-4">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <h2 className="text-lg  font-medium">{subtitle}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header2;
