[
  {
    "RequestorId": "HOD-CS-2026",
    "department": "Computer Science",
    "itemName": "Core i7 Laptops (12th Gen)",
    "priority": "High",
    "quantity": 10
  },
  {
    "RequestorId": "HOD-EE-441",
    "department": "Electrical Engineering",
    "itemName": "Soldering Stations & Multimeters",
    "priority": "Medium",
    "quantity": 5
  },
  {
    "RequestorId": "HOD-MATH-09",
    "department": "Mathematics",
    "itemName": "Whiteboard Markers (Bulk)",
    "priority": "Low",
    "quantity": 50
  }
],
[
  {
    "RequestorId": "HOD-PHY-77",
    "department": "Physics",
    "status": "Approved",
    "itemName": "Laser Optics Kit",
    "priority": "High",
    "quantity": 2
  },
  {
    "RequestorId": "HOD-CHEM-12",
    "department": "Chemistry",
    "status": "Rejected",
    "itemName": "Nitrogen Gas Cylinders",
    "priority": "Medium",
    "quantity": 3
  }
]

//  Bulk Assets (e.g., Furniture or IT peripherals)


[{
  "name": "Ergonomic Office Chairs",
  "category": "Furniture",
  "price": 15000,
  "isBulk": true,
  "quantity": 25,
  "department": "CS Department",
  "condition": "New"
}
]
//  Individual Assets (e.g., Specific Laptop or Lab Equipment)
[
{
  "name": "Dell Latitude 5420",
  "category": "IT & Electronics",
  "price": 125000,
  "isBulk": false,
  "assetTag": "CS-LAP-001",
  "quantity": 1,
  "department": "CS Department",
  "condition": "New"
}
]
// Multiple Items (Array Format for Testing)
[
  {
    "name": "Cisco Router X10",
    "category": "Networking",
    "price": 45000,
    "isBulk": false,
    "assetTag": "NET-RO-55",
    "quantity": 1,
    "department": "IT Unit",
    "condition": "Maintenance"
  },
  {
    "name": "Digital Oscilloscope",
    "category": "Lab Equipment",
    "price": 85000,
    "isBulk": false,
    "assetTag": "LAB-EE-09",
    "quantity": 1,
    "department": "Electrical Engineering",
    "condition": "Damaged"
  },
  {
    "name": "Ceiling Fans",
    "category": "Electrical",
    "price": 5500,
    "isBulk": true,
    "quantity": 10,
    "department": "Administration",
    "condition": "New"
  }
]