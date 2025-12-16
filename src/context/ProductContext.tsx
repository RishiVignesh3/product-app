// import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import type { Product } from "../types/product";
// import { productService, type SortOption } from "../services/productService";

// interface ProductContextType {
//   products: Product[]
//   loading: boolean
//   updateWishList: (productId: number, isWishListed: boolean) => Promise<void>
// }

// const ProductContext = createContext<ProductContextType | null>(null);

// export const ProductProvider = ({ children }: { children: ReactNode }) => {

//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true)

//     const getAllProducts = async (sort: SortOption) => {
//         setLoading(true);
//         const data = await await productService.getAll(sort);
//         setProducts(data);
//         setLoading(false);
//         return data;
//     }

//     useEffect(() => {
//         getAllProducts('name');
//     }, []);

//     const updateWishList = async (productId: number, isWishListed: boolean) => {
//         setLoading(true);
//         const data = await productService.updateWishList(productId, isWishListed);
//         setProducts(prev => prev.map(product => product.id === productId ? data : product));
//         setLoading(false);
//     }

//     return (
//         <ProductContext.Provider value={{ products, loading, updateWishList }}>
//             {children}
//         </ProductContext.Provider>
//     )
// }


// export const useProduct = () => {
//     const context = useContext(ProductContext);
//     if(!context) {
//         throw new Error('useProduct must be used within a ProductProvider')
//     }
//     return context;
// }