import { ENV } from "@/config/app.config";
import { GET, POST } from "@/core/lib/AxiosClient";

export const getBanners = () =>
  GET({
    url: ENV.BASE_URL + "banners",
  });

export const getCategories = () =>
  GET({
    url: ENV.BASE_URL + "menu-categories",
  });

export const getCatMenus = (id: any) =>
  GET({
    url: ENV.BASE_URL + `menu-category/menus/${id}`,
  });

export const getTopickMenus = () =>
  GET({
    url: ENV.BASE_URL + `top-picks`,
  });

export const getAllMenus = () =>
  GET({
    url: ENV.BASE_URL + `menu-category/menus`,
  });

export const getRestaurent = () =>
  GET({
    url: ENV.BASE_URL + `restaurent`,
  });

export const getAddress = () =>
  GET({
    url: ENV.BASE_URL + "user",
  });

export const upateFav = (data: any) =>
  POST({
    url: ENV.BASE_URL + `favouriteMenus`,
    data,
  });

export const upateOrder = (data: any) =>
  POST({
    url: ENV.BASE_URL + `/update-order`,
    data,
  });

export const postOrders = (data: any) =>
  POST({
    url: ENV.BASE_URL + `orders`,
    data,
  });

export const upateUser = (data: any) =>
  POST({
    url: ENV.BASE_URL + `user`,
    data,
  });

export const upateUserAddress = (data: any) =>
  POST({
    url: ENV.BASE_URL + `user/address`,
    data,
  });

export const searchMenus = (data: any) =>
  POST({
    url: ENV.BASE_URL + `search-menu`,
    data,
  });

export const getUsersOrders = (data: any) =>
  GET({
    url: ENV.BASE_URL + `rider-order-history?page=${data.meta.page}&pageSize=5`,
  });

export const postReviews = (data: any) =>
  POST({
    url: ENV.BASE_URL + `review`,
    data,
  });

export const generateOTP = (data: any) =>
  POST({
    url: ENV.AUTH_BASE_URL + `auth/generateotp`,
    data,
  });

export const otpVerify = (data: any) =>
  POST({
    url: ENV.AUTH_BASE_URL + `auth/verifyotp`,
    data,
  });

export const userCreate = (data: any) =>
  POST({
    url: ENV.AUTH_BASE_URL + `dashboard/user/staffs`,
    data,
  });

export const createAddress = (data: any) =>
  POST({
    url: ENV.BASE_URL + `address`,
    data,
  });

export const getOrdersById = (id: any) =>
  GET({
    url: ENV.BASE_URL + `/orders/${id}`,
  });

export const getPincode = () =>
  GET({
    url: ENV.BASE_URL + `/pincodes`,
  });

export const getRiderOrder = (id: any) =>
  GET({
    url: ENV.BASE_URL + `/rider-orders?id=${id}`,
  });


export const getTripCash = () =>
  GET({
    url: ENV.BASE_URL + "rider-trip-cash",
  });


export const test = () =>
  GET({
    url: ENV.BASE_URL + "posts",
  });
