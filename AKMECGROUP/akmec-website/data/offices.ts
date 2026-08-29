export interface Office {
  id: string;
  type: string;
  name: string;
  address: string;
  email?: string;
  phones?: string[];
  coordinates?: { lat: number; lng: number };
}

export const offices: Office[] = [
  {
    id: 'registered-nashik',
    type: 'Registered Office',
    name: 'Nashik, Maharashtra',
    address: 'AKMEC Workshop, Gate No. 1, Plot No. 45, Survey No. 104/2/A, Malegaon, Nashik, Maharashtra – 423203, INDIA',
    phones: ['+91 9226112227', '+91 9920702095'],
    email: 'inquiry@akmecgroup.com',
  },
  {
    id: 'operational-vadodara',
    type: 'Operational Office',
    name: 'Vadodara, Gujarat',
    address: '309 Siddharth Magnum Plus, Dhanteshwar Ring Road, Vadodara – 390004, Gujarat, INDIA',
    phones: ['+91 9226112227', '+91 9920702095'],
    email: 'inquiry@akmecgroup.com',
  },
  {
    id: 'mumbai',
    type: 'Branch Office',
    name: 'Mumbai, Maharashtra',
    address: 'Gala 180B, Kurla Scrap Merchant Ass., Mankhurd Mandala, G M Link Road, Mumbai – 400043, INDIA',
    phones: ['+91 9226112227', '+91 9920702095'],
    email: 'inquiry@akmecgroup.com',
  },
  {
    id: 'overseas-saudi',
    type: 'Overseas Office',
    name: 'Al-Jubail, Saudi Arabia',
    address: 'Masar NDTS Operation & Maintenance, Building No. 4258, Al Safat Dist., Al-Jubail City Centre – 35514, Kingdom of Saudi Arabia',
    email: 'sales@masarNDT.com',
  }
];

