export const registerFormControls = [
    {
      name: "userName",
      label: "User Name",
      placeholder: "Enter your user name",
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];
  
  export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];
  
  export const addProductFormElements = [
    {
      label: "Title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "100A", label: "Collection 100 A" },
        { id: "100B", label: "Collection 100 B" },
        { id: "100C", label: "Collection 100 C" },
        { id: "200A", label: "Collection 200 A" },
        { id: "200B", label: "Collection 200 B" },
        { id: "300", label: "Collection 300" },
        { id: "400", label: "Collection 400" },
        { id: "700", label: "Collection 500-700" },
      ],
    },
    {
      label: "Gender",
      name: "gender",
      componentType: "select",
      options: [
        { id: "Men", label: "Men" },
        { id: "Women", label: "Women" },
        { id: "Kids", label: "Kis" },
        { id: "Unisex", label: "Unisex" },
      ],
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componentType: "input",
      type: "number",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
  ];
  
export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "collection100",
    label: "Collection 100",
    path: "/shop/listing",
    children: [
      { id: "100A", label: "Collection 100A", path: "/shop/listing?category=100A" },
      { id: "100B", label: "Collection 100B", path: "/shop/listing?category=100B" },
      { id: "100C", label: "Collection 100C", path: "/shop/listing?category=100C" },
    ],
  },
  {
    id: "collection200",
    label: "Collection 200",
    path: "/shop/listing",
    children: [
      { id: "200A", label: "Collection 200A", path: "/shop/listing?category=200A" },
      { id: "200B", label: "Collection 200B", path: "/shop/listing?category=200B" },
    ],
  },
  {
    id: "300",
    label: "Collection 300",
    path: "/shop/listing?category=300",
  },
  {
    id: "400",
    label: "Collection 400",
    path: "/shop/listing?category=400",
  },
  {
    id: "700",
    label: "Collection 500–700",
    path: "/shop/listing?category=700",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];
  
export const categoryOptionsMap = {
  "100A": "Collection 100A",
  "100B": "Collection 100B",
  "100C": "Collection 100C",
  "200A": "Collection 200A",
  "200B": "Collection 200B",
  "300": "Collection 300",
  "400": "Collection 400",
  // "500": "Collection 500",
  "700": "Collection 700",
};

  
  export const brandOptionsMap = {
    Men: "Men",
    Women: "Women",
    Kids: "Kids",
    Unisex: "Unisex",
  };
  
  export const filterOptions = {
    category: [
      { id: "100A", label: "Collection 100A" },
      { id: "100B", label: "Collection 100B" },
      { id: "100C", label: "Collection 100C" },
      { id: "200A", label: "Collection 200A" },
      { id: "200B", label: "Collection 200B" },
      { id: "300", label: "Collection 300" },
      { id: "400", label: "Collection 400" },
      // { id: "500", label: "Collection 500" },
      { id: "700", label: "Collection 500-700" },
    ],

    gender: [
      { id: "Men", label: "Men" },
      { id: "Women", label: "Women" },
      { id: "Kids", label: "Kids" },
      { id: "Unisex", label: "Unisex" },

    ],
  };
  
  export const sortOptions = [
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
  ];
  
  export const addressFormControls = [
    {
      label: "Address",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Enter your address",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      label: "Pincode",
      name: "pincode",
      componentType: "input",
      type: "text",
      placeholder: "Enter your pincode",
    },
    {
      label: "Phone",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      label: "Notes",
      name: "notes",
      componentType: "textarea",
      placeholder: "Enter any additional notes",
    },
  ];