export const localCartFromStorage = () => {
    if(typeof window === "undefined") return undefined;

    try{
        const serializedCart = localStorage.getItem("cart");
        if(!serializedCart) return undefined;
        return JSON.parse(serializedCart);
    }catch(error){
        console.error("Failed to load cart: ",error);
        return undefined;
    }
}

export const saveCartToStorage = (cartState) => {
    if(typeof window === "undefined") return;
    try{
        const serializedCart = JSON.stringify(cartState);
        localStorage.setItem("cart",serializedCart);
    }catch(error){
        console.error("Failed to save cart: ",error);
    }
}