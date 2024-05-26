import { createContext, useContext, useEffect, useState } from "react";

const ShoppingCartContext = createContext({});

const initialCartItems = sessionStorage.getItem("shopping-cart")
  ? JSON.parse(sessionStorage.getItem("shopping-cart"))
  : [];

const ShoppingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  useEffect(() => {
    sessionStorage.setItem("shopping-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  const cartTotalPrice = cartItems.reduce((price, item) => item.quantity * item.price + price, 0);
  const cartTotalPoints = cartItems.reduce((points, item) => item.quantity * item.point + points, 0);

  const addCartItem = (e, quantity = 1) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item._id === e._id) === undefined) {
        return [...currItems, { ...e, quantity: quantity }];
      } else {
        return currItems.map((item) => {
          if (item._id === e._id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const increaseCartQuantity = (id) => {
    setCartItems((currItems) => {
      return currItems.map((item) => {
        if (item._id === id) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    });
  };

  const decreaseCartQuantity = (id) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item._id === id)?.quantity === 1) {
        return currItems.filter((item) => item._id !== id);
      } else {
        return currItems.map((item) => {
          if (item._id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((currItems) => currItems.filter((item) => item._id !== id));
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        addCartItem,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartQuantity,
        cartTotalPrice,
        cartTotalPoints,
        cartItems,
        setCartItems,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};
