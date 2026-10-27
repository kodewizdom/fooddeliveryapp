export const isActiveStyles = "text-2xl text-red-700 font=semibold hover:text-red-700 px-4 py-2 duration-100 transition-all ease-in-out";

export const isNoActiveStyles = "text-xl text-textColor hover:text-red-700 duration-100 px-4 py-2 transition-all ease-in-out";

export const homeCategories = [
    { id: 1, title: "Drinks", category: "drinks" },
    { id: 2, title: "Bread", category: "bread" },
    { id: 3, title: "Burger", category: "burger" },
    { id: 4, title: "Pizza", category: "pizza" },
    { id: 5, title: "Chinese", category: "chinese" },
    { id: 6, title: "Biryani", category: "biryani" },
    { id: 7, title: "Curry", category: "curry" },
    { id: 8, title: "Deserts", category: "deserts" },
];

export const statuses = [
    { id: 1, title: "Drinks", category: "drinks" }, 
    { id: 2, title: "Bread", category: "bread" },
    { id: 3, title: "Burger", category: "burger" },
    { id: 4, title: "Pizza", category: "pizza" },
    { id: 5, title: "Chinese", category: "chinese" }, 
    { id: 6, title: "Biryani", category: "biryani" },
    { id: 7, title: "Curry", category: "curry" }, 
    { id: 8, title: "Rice", category: "rice" },
    { id: 9, title: "Fish", category: "fish" },
    { id: 10, title: "Deserts", category: "deserts" }, 
    { id: 11, title: "Fruits", category: "fruits" },
    { id: 12, title: "Chicken", category: "chicken" },
];

export const randomData = [
    {
        id: 1,
        imageURL: "https://res.cloudinary.com/dtpzcv8v/image/upload/v1793019184/Icecreame1.png",
        product_name: "Berry Bliss Swirl",
        product_category: "Creamy Ice Cream",
        product_price: "95.00",
    },
    {
        id: 2,
        imageURL: "https://res.cloudinary.com/dtpzcv8v/image/upload/v1793019181/Fruit1.png",
        product_name: "Fresh Strawberries",
        product_category: "Juicy Red Berries",
        product_price: "140.00",
    },
    {
        id: 3,
        imageURL: "https://res.cloudinary.com/dtpzcv8v/image/upload/v1793019176/Burger1.png",
        product_name: "Cheese Supreme",
        product_category: "Gourmet Burger",
        product_price: "189.00",
    },
    {
        id: 4,
        imageURL: "https://res.cloudinary.com/dtpzcv8v/image/upload/v1793019188/Pizza1.png",
        product_name: "Margherita Supreme",
        product_category: "Classic Italian Pizza",
        product_price: "299.00",
    },
];

// High-performance image optimization helper (WebP, auto quality, width limit)
export const getOptimizedImageUrl = (url, width = 500) => {
    if (!url || typeof url !== "string") return url;
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
        if (url.includes("/upload/f_auto,q_auto")) return url;
        return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
    if (url.includes("unsplash.com")) {
        const base = url.split("?")[0];
        return `${base}?w=${width}&auto=format&fit=crop&q=80`;
    }
    return url;
};    