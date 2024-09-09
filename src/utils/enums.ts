import { Course, Branch, Year } from "@prisma/client";

export const stringToCourse = (value: string): Course => {
  return Course[value as keyof typeof Course];
};

export const stringToBranch = (value: string): Branch => {
  return Branch[value as keyof typeof Branch];
};

export const stringToYear = (value: string): Year => {
  return Year[value as keyof typeof Year];
};
