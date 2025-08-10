import { MediaType } from "../../config";
import Handler from "./Handler";

export default [
    {
        path: '/gettoken',
        type: MediaType.POST,
        middleware: [],
        method: Handler.getCustomerToken,
        options: {}
    }
];
