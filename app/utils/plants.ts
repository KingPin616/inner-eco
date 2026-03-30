export type Plant = {
  id: string;
  name: {
    common: string;
    scientific: string;
  };
  age: string;
  description: string;
  imageUrl: string;
  qrCodeUrl?: string;
};
