export interface Metadata {
  id: number;
  path: string;
  type: string;
}

export const convertResponseToMetadata = (response: any) => ({
  id: response.id,
  path: response.path,
  type: response.type,
});
