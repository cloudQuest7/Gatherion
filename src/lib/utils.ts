import { UserProfile, RandomUserResponse } from '@/types';

export const fetchRandomUsers = async (count: number): Promise<UserProfile[]> => {
  const response = await fetch(`https://randomuser.me/api/?results=${count}&inc=name,picture,email`);
  const data = await response.json();
  return data.results.map((user: RandomUserResponse) => ({
    name: `${user.name.first} ${user.name.last}`,
    avatar: user.picture.medium,
    email: user.email
  }));
};

export const scrollToSection = (id: string, setActiveSection?: (id: string) => void, setIsOpen?: (isOpen: boolean) => void): void => {
  if (setActiveSection) setActiveSection(id);
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  if (setIsOpen) setIsOpen(false);
};
