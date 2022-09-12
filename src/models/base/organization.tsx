export interface Organization {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  numberUser: number;
}

export const convertResponseToOrganization = (response: any) => ({
  id: response.id,
  name: response.name,
  email: response.email,
  phone: response.phone,
  address: response.address,
  description: response.description,
  numberUser: response.number_user,
});
