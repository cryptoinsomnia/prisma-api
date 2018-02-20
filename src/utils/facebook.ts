import axios from 'axios';

interface Employer {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
}

interface Work {
  employer: [Employer];
}

interface Education {
  school: [School];
}

interface PictureData {
  url: string;
}

interface Picture {
  data: PictureData;
}

export interface FacebookUser {
  id: string;
  email: string | null;
  name: string | null;
  first_name: string;
  last_name: string;
  gender: string | null;
  locale: string;
  birthday: string | null;
  education: Education | null;
  work: Work | null;
  picture: Picture;
}

const ENDPOINT = 'https://graph.facebook.com';
const API_VERSION = 'v2.9';
const fields = `id,name,first_name,last_name,email,picture`;

export const getFacebookUser = async (
  facebookToken: string,
): Promise<FacebookUser> => {
  const endpoint = `${ENDPOINT}/${API_VERSION}/me?fields=${fields}&access_token=${facebookToken}`;

  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
