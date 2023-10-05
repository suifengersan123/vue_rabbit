//管理用户数据相关
import { loginAPI } from "@/apis/user";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useCartStore } from "./cartStore";
import { mergeCartAPI } from "@/apis/cart";

export const useUserStore=defineStore('user',()=>{
    const cartStore=useCartStore();
    //定义管理用户数据的state
    const userInfo=ref({});
    //定义获取接口数据的action函数
    const getUserInfo=async(account,password)=>{
        const res= await loginAPI({account,password});
        userInfo.value=res.result;
        //合并购物车
       await mergeCartAPI(cartStore.cartList.map(item=>{
            return {
                skuId:item.skuId,
                selected:item.selected,
                count:item.count
            }
        })); 
        cartStore.updateCartList();
    };

    //退出时清除用户信息

    const clearUserInfo=()=>{
        userInfo.value={};
        //执行清除购物车
        cartStore.clearCart();
    };

    // 以对象的格式将state和action 返回
    return{
        userInfo,
        getUserInfo,
        clearUserInfo
    }
},
{
    persist:true
})