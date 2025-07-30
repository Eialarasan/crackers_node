import { isValidEmail, isValidPassword, isValidPasswordMaxLength, isValidPhoneNumber, isValidUsername, isValidateMaxLength, isValidateUserMaxLength } from "../../util";
import Service from "./Service";

class CategoryHandler {
    async CatogoryAdd(req, res) {
        try {
            const data = req.body
            const { name,price,storeId} = data
            if (!name) {
                return res.send({ response_code: 2, response_message: "category is missing", response_code: 1 });
            }
             else if (!storeId) {
                return res.send({ response_code: 2, response_message: "store is missing", response_code: 1 });
            } else {
                await Service.CategoryAdd(data, res)
            }
        } catch (error) {
            console.error("Cate_ADD",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    

    async updateCategory(req, res) {
        try {
            const data = req.body
                await Service.UpdateCategory(data, res)
        } catch (error) {
            console.error("UPDATE_CATEGORY", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async deleteCategory(req, res) {
        try {
            const data = req.body
            await Service.DeleteCategory(data, res)
        } catch (error) {
            console.error("DELETE_CATEGORY", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }

    async getCategoryList(req, res) {
        try {
            const data=req.query
            await Service.GetCategoryList(data,res)
        } catch (error) {
            console.error("GET_Category_LIST", error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
    async RefreshToken(req, res) {
        try {
            const userId = req.user.userId
            await Service.RefreshToken(res, userId)
        } catch (error) {
            console.error("REFRESH_TOKEN",error)
            return res.status(500).send({ response_code: 2, response_message: "Sorry something went wrong" });
        }
    }
}
export default new CategoryHandler();